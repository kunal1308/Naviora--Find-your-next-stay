// /destinations — Server Component. Reads the destinations collection from
// Firestore and links each to a filtered hotels search.

import type { Metadata } from "next";
import { getDestinations } from "@/services/destinations";
import DestinationsGrid from "@/features/destinations/components/DestinationsGrid";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse Naviora destinations — Goa, Jaipur, Dubai, Tokyo and more — and find hotels in each.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  if (destinations.length === 0) {
    return (
      <div className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Destinations
        </h1>
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-lg font-medium text-slate-700">
            No destinations yet.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Seed the database at{" "}
            <code className="rounded bg-slate-200 px-1">/api/seed</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6">
      <DestinationsGrid destinations={destinations} />
    </div>
  );
}
