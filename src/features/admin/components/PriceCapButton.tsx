"use client";

// Admin-only "make prices test-payable" button. Scans every hotel and lowers
// any nightly rate whose INR-equivalent is above TEST_MAX_INR_PER_NIGHT, so
// bookings stay under Razorpay TEST mode's per-transaction cap. Only touches
// pricePerNight; existing bookings keep their own stored totals. Runs while the
// admin is signed in, so writes satisfy firestore.rules (isAdmin()).

import { useState } from "react";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getHotels } from "@/services/hotels";
import { useToast } from "@/components/ui/ToastProvider";
import { capPriceNative } from "@/lib/firebase/generateCatalog";

export default function PriceCapButton() {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function handleCap() {
    setBusy(true);
    try {
      const hotels = await getHotels();
      const toFix = hotels.filter(
        (h) => capPriceNative(h.pricePerNight, h.currency) !== h.pricePerNight,
      );

      if (toFix.length === 0) {
        toast.info("All hotel prices are already within the test limit.");
        return;
      }

      const batch = writeBatch(db);
      toFix.forEach((h) => {
        batch.update(doc(db, "hotels", h.id), {
          pricePerNight: capPriceNative(h.pricePerNight, h.currency),
        });
      });
      await batch.commit();

      toast.success(`Lowered ${toFix.length} hotel price(s).`);
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update prices.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCap}
      disabled={busy}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
    >
      {busy ? "Updating…" : "Cap prices for test payments"}
    </button>
  );
}
