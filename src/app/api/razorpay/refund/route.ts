// POST /api/razorpay/refund — refunds part or all of a booking's payment(s).
//
// The refund amount is computed HERE from the hotel price + dates (never taken
// from the client), so a user can't ask for more than they're owed:
//   • cancel:            refund the whole old total
//   • shorten the stay:  refund (old total − new total)
//
// Payment amounts come from Razorpay itself (getPayment), and a booking may
// have several payments (original + top-ups), so we spread the refund across
// them, newest first, up to each payment's remaining refundable amount.
//
// Note: like the rest of the app's booking rules, ownership is enforced by
// Firestore rules on the write, not re-checked here. A production build would
// verify the caller owns this booking server-side before refunding.

import { NextResponse } from "next/server";
import { getHotelById } from "@/services/hotels";
import { toINR } from "@/utils";
import { nightsBetween, totalNative } from "@/lib/pricing";
import { getPayment, isRazorpayConfigured, refundPayment } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 500 },
      );
    }

    const {
      paymentIds,
      hotelId,
      prevCheckIn,
      prevCheckOut,
      checkIn,
      checkOut,
      cancel,
    } = await request.json();

    if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
      return NextResponse.json(
        { error: "No payment to refund." },
        { status: 400 },
      );
    }

    const hotel = await getHotelById(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const oldTotalNative = totalNative(
      hotel.pricePerNight,
      prevCheckIn,
      prevCheckOut,
    );

    let refundNative: number;
    if (cancel) {
      refundNative = oldTotalNative;
    } else {
      if (nightsBetween(checkIn, checkOut) < 1) {
        return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
      }
      refundNative = oldTotalNative - totalNative(hotel.pricePerNight, checkIn, checkOut);
    }

    if (refundNative <= 0) {
      return NextResponse.json(
        { error: "Nothing to refund." },
        { status: 400 },
      );
    }

    let remaining = Math.round(toINR(refundNative, hotel.currency) * 100);
    const refunds: { paymentId: string; refundId: string; amount: number }[] =
      [];

    // Newest payments first so the most recent top-up is unwound before the
    // original charge.
    for (const paymentId of [...paymentIds].reverse()) {
      if (remaining <= 0) break;
      const payment = await getPayment(paymentId);
      const refundable = (payment.amount ?? 0) - (payment.amount_refunded ?? 0);
      if (refundable <= 0) continue;
      const amount = Math.min(remaining, refundable);
      const r = await refundPayment(paymentId, amount);
      refunds.push({ paymentId, refundId: r.id, amount });
      remaining -= amount;
    }

    if (refunds.length === 0) {
      return NextResponse.json(
        { error: "Payment is already fully refunded." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      refunds,
      refundedPaise: refunds.reduce((sum, r) => sum + r.amount, 0),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refund failed" },
      { status: 500 },
    );
  }
}
