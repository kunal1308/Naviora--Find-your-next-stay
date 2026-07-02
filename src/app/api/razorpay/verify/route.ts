// POST /api/razorpay/verify — verifies the payment signature server-side.
// Only if this returns { valid: true } does the client write the booking.

import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const { orderId, paymentId, signature } = await request.json();

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { valid: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    valid: verifySignature(orderId, paymentId, signature),
  });
}
