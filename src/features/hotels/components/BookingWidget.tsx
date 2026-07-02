"use client";

// Client Component: form state + live price math + Razorpay payment.
// Flow on Reserve:
//   1. require auth (else → /login)
//   2. POST /api/razorpay/order   (server computes the amount)
//   3. open Razorpay Checkout
//   4. on success → POST /api/razorpay/verify   (server verifies signature)
//   5. only if valid → write the booking (client SDK, still authenticated)

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Booking, Hotel } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import { useAuth } from "@/features/auth/AuthProvider";
import { createBooking, getActiveBookingForHotel } from "@/services/bookings";
import { ROUTES } from "@/constants";
import { trackEvent } from "@/lib/analytics";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Load the Razorpay Checkout script once, on demand.
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingWidget({ hotel }: { hotel: Hotel }) {
  const router = useRouter();
  const { user } = useAuth();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<Booking | null>(null);

  let nights = 0;
  if (checkIn && checkOut) {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    nights = diff > 0 ? Math.round(diff / MS_PER_DAY) : 0;
  }
  const subtotal = nights * hotel.pricePerNight;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const fmt = (n: number) => formatCurrency(n, hotel.currency);

  // Your own listing — you can't book it; offer to manage it instead.
  if (user && hotel.ownerId === user.uid) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
        <div className="text-2xl">🏡</div>
        <h3 className="mt-2 font-semibold text-slate-900">
          This is your listing
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          You can&apos;t book your own property.
        </p>
        <Link
          href={ROUTES.hostEditHotel(hotel.id)}
          className="mt-4 inline-block rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          Manage listing
        </Link>
      </div>
    );
  }

  // Called after Razorpay reports a successful payment.
  async function finalizeBooking(response: RazorpayResponse) {
    try {
      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        }),
      });
      const verify = await verifyRes.json();
      if (!verify.valid) throw new Error("Payment could not be verified.");

      await createBooking({
        hotelId: hotel.id,
        userId: user!.uid,
        checkIn,
        checkOut,
        guests,
        totalPrice: total,
        currency: hotel.currency,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        paymentId: response.razorpay_payment_id,
      });

      void trackEvent("purchase", {
        item_id: hotel.id,
        value: total,
        currency: hotel.currency,
        nights,
      });
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function startPayment() {
    setError(null);
    setSubmitting(true);
    try {
      // 1. Create the order on the server.
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId: hotel.id, checkIn, checkOut, guests }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Could not start payment.");

      void trackEvent("begin_checkout", {
        item_id: hotel.id,
        value: total,
        currency: hotel.currency,
        nights,
      });

      // 2. Load the checkout script.
      const ready = await loadRazorpayScript();
      if (!ready) throw new Error("Failed to load the payment window.");

      // 3. Open Razorpay Checkout.
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Naviora",
        description: `${nights} night(s) · ${hotel.name}`,
        order_id: order.orderId,
        prefill: {
          name: user?.displayName ?? "",
          email: user?.email ?? "",
        },
        theme: { color: "#0d9488" },
        // Surface UPI as the first block; other methods still show below it.
        config: {
          display: {
            blocks: {
              upi: { name: "Pay using UPI", instruments: [{ method: "upi" }] },
            },
            sequence: ["block.upi"],
            preferences: { show_default_blocks: true },
          },
        },
        handler: (response) => finalizeBooking(response),
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
      setSubmitting(false);
    }
  }

  // Entry point for the Reserve button: require auth, then warn if the user
  // already has an upcoming booking at this hotel before starting payment.
  async function handleReserve() {
    if (!user) {
      router.push(ROUTES.login);
      return;
    }
    setError(null);
    setSubmitting(true);
    let duplicate: Booking | null = null;
    try {
      duplicate = await getActiveBookingForHotel(user.uid, hotel.id);
    } catch {
      duplicate = null; // don't block booking if the check fails
    }
    if (duplicate) {
      setExisting(duplicate);
      setSubmitting(false);
      return;
    }
    startPayment();
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
        <div className="text-3xl">✅</div>
        <h3 className="mt-2 font-semibold text-green-900">Booking confirmed!</h3>
        <p className="mt-1 text-sm text-green-800">
          {nights} {nights === 1 ? "night" : "nights"} at {hotel.name} ·{" "}
          {fmt(total)}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={ROUTES.profile}
            className="rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            View my bookings
          </Link>
          <button
            type="button"
            onClick={() => {
              setConfirmed(false);
              setCheckIn("");
              setCheckOut("");
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Book another stay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">
          {fmt(hotel.pricePerNight)}
        </span>
        <span className="text-sm text-slate-500">/ night</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Check-in
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Check-out
          <input
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-3 flex flex-col gap-1 text-xs font-medium text-slate-500">
        Guests
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
        >
          {Array.from({ length: hotel.maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>

      {nights > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>
              {fmt(hotel.pricePerNight)} × {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Taxes &amp; fees (12%)</span>
            <span>{fmt(taxes)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleReserve}
        disabled={nights === 0 || submitting}
        className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting
          ? "Processing…"
          : nights === 0
            ? "Select dates"
            : user
              ? "Reserve & pay"
              : "Sign in to reserve"}
      </button>
      <p className="mt-2 text-center text-xs text-slate-400">
        Test mode — pay via Netbanking (any bank)
      </p>

      {existing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setExisting(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              You already have a booking here
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              You have an upcoming stay at {hotel.name} (
              {formatDate(existing.checkIn)} → {formatDate(existing.checkOut)}).
              Edit it in My Bookings, or create a separate new booking.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href={ROUTES.profile}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-center font-semibold text-white hover:bg-brand-700"
              >
                Edit in My Bookings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setExisting(null);
                  startPayment();
                }}
                className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Create a new booking
              </button>
              <button
                type="button"
                onClick={() => setExisting(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Never mind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
