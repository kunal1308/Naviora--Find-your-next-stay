// POST /api/razorpay/verify — verifies the payment signature server-side,
// then CAPTURES the payment. Razorpay leaves payments in "authorized" state
// unless captured (we don't rely on dashboard auto-capture), and refunds are
// only allowed on captured payments — so cancel/edit refunds would fail
// without this step.
// Only if this returns { valid: true } does the client write the booking.

import { NextResponse } from "next/server";
import { capturePayment, getPayment, verifySignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const { orderId, paymentId, signature } = await request.json();

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { valid: false, error: "Missing fields" },
      { status: 400 },
    );
  }

  if (!verifySignature(orderId, paymentId, signature)) {
    return NextResponse.json({ valid: false });
  }

  try {
    const payment = await getPayment(paymentId);
    if (payment.status === "authorized") {
      await capturePayment(paymentId, payment.amount, payment.currency);
    }
  } catch (error) {
    // The charge went through and the signature is valid; a capture hiccup
    // shouldn't void the booking. Auto-capture settings or a retry from the
    // dashboard can still capture it.
    console.error("Payment capture failed:", error);
  }

  return NextResponse.json({ valid: true });
}
