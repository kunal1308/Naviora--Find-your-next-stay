"use client";

// Modal to edit an existing booking's dates/guests. Allowed only while the
// booking's check-in is at least 1 day away (checked here and again on save).
// Price is recomputed; in this demo we don't re-charge a price difference.

import { useState } from "react";
import type { Booking, Hotel } from "@/types";
import { formatCurrency } from "@/utils";
import { updateBooking, canModifyBooking } from "@/services/bookings";

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

  async function handleSave() {
    setError(null);

    // The original booking must still be within the edit window.
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
      await updateBooking(booking.id, {
        checkIn,
        checkOut,
        guests,
        totalPrice: total,
        currency,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
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
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">
            <span>
              New total ({nights} {nights === 1 ? "night" : "nights"})
            </span>
            <span>{formatCurrency(total, currency)}</span>
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
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>

        {nights > 0 && total !== booking.totalPrice && (
          <p className="mt-2 text-xs text-slate-400">
            Price differences aren&apos;t re-charged in this demo.
          </p>
        )}
      </div>
    </div>
  );
}
