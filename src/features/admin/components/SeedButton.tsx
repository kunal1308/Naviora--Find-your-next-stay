"use client";

// Admin-only "add sample hotels" button. ADD-ONLY: each click appends new
// random hotels (unique ids) — it never deletes or replaces anything. Host
// listings, curated hotels, and user data are all left intact. Runs while the
// admin is signed in, so writes satisfy firestore.rules (isAdmin()).

import { useState } from "react";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getHotels } from "@/services/hotels";
import { useToast } from "@/components/ui/ToastProvider";
import {
  generateHotels,
  generateReviews,
  buildDestinations,
} from "@/lib/firebase/generateCatalog";

const ADD_COUNT = 10;

export default function SeedButton() {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function handleSeed() {
    setBusy(true);
    try {
      // 1. Append new hotels + a few reviews (unique ids — nothing overwritten).
      const newHotels = generateHotels(ADD_COUNT);
      const reviews = generateReviews(newHotels);
      const addBatch = writeBatch(db);
      newHotels.forEach((h) => addBatch.set(doc(db, "hotels", h.id), h));
      reviews.forEach((r) => addBatch.set(doc(db, "reviews", r.id), r));
      await addBatch.commit();

      // 2. Refresh destination counts from the full catalog (non-destructive).
      const all = await getHotels();
      const destBatch = writeBatch(db);
      buildDestinations(all).forEach((d) =>
        destBatch.set(doc(db, "destinations", d.id), d),
      );
      await destBatch.commit();

      toast.success(
        `Added ${newHotels.length} hotels. Catalog now has ${all.length}.`,
      );
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add hotels.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSeed}
      disabled={busy}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
    >
      {busy ? "Adding…" : `Add ${ADD_COUNT} sample hotels`}
    </button>
  );
}
