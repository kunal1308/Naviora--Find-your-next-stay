// Route Handler: app/api/seed/route.ts → GET /api/seed
// This is the App Router's way to build backend endpoints (no Express needed).
//
// Visit http://localhost:3000/api/seed once to load Firestore with our hotels
// and reviews. It's idempotent — if data already exists it skips, unless you
// pass ?force=1 to overwrite.
//
// ⚠️ This is a development convenience. Delete this route (or lock it down)
// before deploying to production.

import { NextResponse } from "next/server";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HOTELS, DESTINATIONS, REVIEWS } from "@/lib/firebase/seedData";

export async function GET(request: Request) {
  try {
    const force = new URL(request.url).searchParams.get("force") === "1";

    const existing = await getDocs(collection(db, "hotels"));
    if (!existing.empty && !force) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: `Already seeded (${existing.size} hotels). Add ?force=1 to overwrite.`,
      });
    }

    // A batch writes everything atomically in one round-trip (limit: 500 ops).
    const batch = writeBatch(db);
    HOTELS.forEach((hotel) => batch.set(doc(db, "hotels", hotel.id), hotel));
    DESTINATIONS.forEach((dest) =>
      batch.set(doc(db, "destinations", dest.id), dest),
    );
    REVIEWS.forEach((review) => batch.set(doc(db, "reviews", review.id), review));
    await batch.commit();

    return NextResponse.json({
      ok: true,
      seeded: {
        hotels: HOTELS.length,
        destinations: DESTINATIONS.length,
        reviews: REVIEWS.length,
      },
    });
  } catch (error) {
    // Most common cause: Firestore not created yet, or rules deny writes.
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 },
    );
  }
}
