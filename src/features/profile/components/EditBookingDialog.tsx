"use client";

// Modal to edit an existing booking's dates/guests. Allowed only while the
// booking's check-in is at least 1 day away (checked here and again on save).
//
// The price is recomputed and the difference is settled for real (test mode):
//   • more nights  → charge the difference via Razorpay, then save
//   • fewer nights → refund the difference via Razorpay, then save
//   • same price   → just save (e.g. only guests changed)

import { useState } from "react";
import type { Booking, Hotel } from "@/types";
import { formatCurrency } from "@/utils";
import { useAuth } from "@/features/auth/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import {
  updateBooking,
  canModifyBooking,
  paymentIdsOf,
} from "@/services/bookings";
import { loadRazorpayScript } from "@/lib/razorpay/loadCheckout";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export default function EditBookingDialog({
  booking,
  hotel,
  onClose,
  onSaved,
}: {
  booking: Booking;
  hotel?: Hotel;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const toast = useToast();
  const [checkIn, setCheckIn] = useState(booking.checkIn);
  const [checkOut, setCheckOut] = useState(booking.checkOut);
  const [guests, setGuests] = useState(booking.guests);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerNight = hotel?.pricePerNight ?? 0;
  const currency = hotel?.currency ?? booking.currency;
  const maxGuests = hotel?.maxGuests ?? Math.max(guests, 1);

  let nights = 0;
  if (checkIn && checkOut) {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    nights = diff > 0 ? Math.round(diff / MS_PER_DAY) : 0;
  }
  const subtotal = nights * pricePerNight;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  // Difference vs what was originally paid. >0 = owe more, <0 = refund due.
  const delta = nights > 0 ? total - booking.totalPrice : 0;

  const confirmLabel = saving
    ? "Working…"
    : delta > 0
      ? "Pay difference & save"
      : delta < 0
        ? "Refund & save"
        : "Save changes";

  // Persist the new dates/guests/total, merging in any new payment/refund ids.
  async function persist(patch: Partial<Booking>) {
    await updateBooking(booking.id, {
      checkIn,
      checkOut,
      guests,
      totalPrice: total,
      currency,
      ...patch,
    });
    onSaved();
  }

  // Charge the increase via Razorpay, then save on a verified payment.
  async function payDifferenceThenSave() {
    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: booking.hotelId,
        checkIn,
        checkOut,
        prevCheckIn: booking.checkIn,
        prevCheckOut: booking.checkOut,
      }),
    });
    const order = await orderRes.json();
    if (!orderRes.ok) throw new Error(order.error || "Could not start payment.");

    const ready = await loadRazorpayScript();
    if (!ready) throw new Error("Failed to load the payment window.");

    await new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Naviora",
        description: `Booking change · ${hotel?.name ?? booking.hotelId}`,
        order_id: order.orderId,
        prefill: { name: user?.displayName ?? "", email: user?.email ?? "" },
        theme: { color: "#0d9488" },
        handler: async (response: RazorpayResponse) => {
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
            await persist({
              payments: [...paymentIdsOf(booking), response.razorpay_payment_id],
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled.")),
        },
      });
      rzp.open();
    });
  }

  // Refund the decrease, then save.
  async function refundThenSave() {
    const paymentIds = paymentIdsOf(booking);
    if (paymentIds.length === 0) {
      // Nothing was ever paid (legacy booking) — just save the shorter stay.
      await persist({});
      return;
    }
    const refundRes = await fetch("/api/razorpay/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIds,
        hotelId: booking.hotelId,
        prevCheckIn: booking.checkIn,
        prevCheckOut: booking.checkOut,
        checkIn,
        checkOut,
      }),
    });
    const result = await refundRes.json();
    if (!refundRes.ok) throw new Error(result.error || "Refund failed.");
    await persist({
      refunds: [
        ...(booking.refunds ?? []),
        ...result.refunds.map((r: { refundId: string }) => r.refundId),
      ],
    });
  }

  async function handleSave() {
    setError(null);

    if (!canModifyBooking(booking.checkIn)) {
      setError("This booking can no longer be changed (less than 1 day to check-in).");
      return;
    }
    if (nights < 1) {
      setError("Choose a valid check-in and check-out.");
      return;
    }
    if (!canModifyBooking(checkIn)) {
      setError("New check-in must be at least 1 day from now.");
      return;
    }

    setSaving(true);
    try {
      if (delta > 0) {
        await payDifferenceThenSave();
        toast.success("Payment complete — booking updated.");
      } else if (delta < 0) {
        await refundThenSave();
        toast.success("Booking updated — refund issued.");
      } else {
        await persist({});
        toast.success("Booking updated.");
      }
    } catch (err) {
      // A cancelled Razorpay window shouldn't look like a hard error.
      const message = err instanceof Error ? err.message : "Update failed.";
      if (message !== "Payment cancelled.") {
        setError(message);
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-900">Edit booking</h3>
        <p className="mt-1 text-sm text-slate-500">
          {hotel?.name ?? booking.hotelId}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
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
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>

        {nights > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>
                New total ({nights} {nights === 1 ? "night" : "nights"})
              </span>
              <span>{formatCurrency(total, currency)}</span>
            </div>
            {delta > 0 && (
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Additional payment</span>
                <span>{formatCurrency(delta, currency)}</span>
              </div>
            )}
            {delta < 0 && (
              <div className="flex justify-between font-semibold text-green-700">
                <span>Refund to you</span>
                <span>{formatCurrency(-delta, currency)}</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
