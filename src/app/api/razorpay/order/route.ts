// POST /api/razorpay/order — creates a Razorpay order.
// The amount is computed HERE on the server from the hotel + dates, so the
// client can't tamper with the price. Charged in INR (converted from the
// hotel's native currency), since Razorpay test mode uses INR.

import { NextResponse } from "next/server";
import { getHotelById } from "@/services/hotels";
import { toINR } from "@/utils";
import {
  createOrder,
  getRazorpayKeyId,
  isRazorpayConfigured,
} from "@/lib/razorpay";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 500 },
      );
    }

    const { hotelId, checkIn, checkOut } = await request.json();

    const hotel = await getHotelById(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_DAY,
    );
    if (!nights || nights < 1) {
      return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
    }

    const subtotal = nights * hotel.pricePerNight;
    const taxes = Math.round(subtotal * 0.12);
    const totalNative = subtotal + taxes;
    const amountPaise = Math.round(toINR(totalNative, hotel.currency) * 100);

    const order = await createOrder(
      amountPaise,
      `naviora_${hotelId}`.slice(0, 40),
    );

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      totalNative,
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
