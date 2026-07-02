// POST /api/razorpay/order — creates a Razorpay order.
// The amount is computed HERE on the server from the hotel + dates, so the
// client can't tamper with the price. Charged in INR (converted from the
// hotel's native currency), since Razorpay test mode uses INR.
//
// Top-up mode: if prevCheckIn/prevCheckOut are sent (editing a booking to more
// nights), we charge only the DIFFERENCE between the new and old totals — both
// computed server-side, so the delta can't be tampered with either.

import { NextResponse } from "next/server";
import { getHotelById } from "@/services/hotels";
import { toINR } from "@/utils";
import { nightsBetween, totalNative } from "@/lib/pricing";
import {
  createOrder,
  getRazorpayKeyId,
  isRazorpayConfigured,
} from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 500 },
      );
    }

    const { hotelId, checkIn, checkOut, prevCheckIn, prevCheckOut } =
      await request.json();

    const hotel = await getHotelById(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const nights = nightsBetween(checkIn, checkOut);
    if (nights < 1) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    const newTotalNative = totalNative(hotel.pricePerNight, checkIn, checkOut);

    // Default: charge the full new total. Top-up: charge just the increase.
    let chargeNative = newTotalNative;
    if (prevCheckIn && prevCheckOut) {
      const oldTotalNative = totalNative(
        hotel.pricePerNight,
        prevCheckIn,
        prevCheckOut,
      );
      chargeNative = newTotalNative - oldTotalNative;
      if (chargeNative <= 0) {
        return NextResponse.json(
          { error: "No additional payment is required." },
          { status: 400 },
        );
      }
    }

    const amountPaise = Math.round(toINR(chargeNative, hotel.currency) * 100);

    const order = await createOrder(
      amountPaise,
      `naviora_${hotelId}`.slice(0, 40),
    );

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      totalNative: newTotalNative,
      chargeNative,
      currencyNative: hotel.currency,
      nights,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order failed" },
      { status: 500 },
    );
  }
}
