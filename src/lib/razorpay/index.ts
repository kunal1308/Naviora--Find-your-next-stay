// Razorpay setup — SERVER ONLY. Uses the secret key and Node crypto, so this
// must only be imported from route handlers, never from a client component.
// We call Razorpay's REST API with fetch (no SDK dependency needed).

import crypto from "crypto";

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

export function isRazorpayConfigured(): boolean {
  return Boolean(KEY_ID && KEY_SECRET);
}

export function getRazorpayKeyId(): string {
  return KEY_ID;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

// Create an order. Amount is in the smallest currency unit (paise for INR).
export async function createOrder(
  amountPaise: number,
  receipt: string,
): Promise<RazorpayOrder> {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order failed: ${await res.text()}`);
  }
  return res.json();
}

interface RazorpayPayment {
  id: string;
  amount: number; // captured amount, paise
  amount_refunded: number; // already refunded, paise
  status: string;
}

// Fetch a payment so we can see how much is still refundable. Using Razorpay
// as the source of truth means the client never gets to name a refund amount.
export async function getPayment(paymentId: string): Promise<RazorpayPayment> {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    throw new Error(`Razorpay payment lookup failed: ${await res.text()}`);
  }
  return res.json();
}

// Issue a refund against a payment. amountPaise omitted = full refund.
export async function refundPayment(
  paymentId: string,
  amountPaise?: number,
): Promise<{ id: string; amount: number }> {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch(
    `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body:
        amountPaise != null ? JSON.stringify({ amount: amountPaise }) : undefined,
    },
  );
  if (!res.ok) {
    throw new Error(`Razorpay refund failed: ${await res.text()}`);
  }
  return res.json();
}

// Verify the payment signature Razorpay sends back after checkout.
// signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret).
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}
