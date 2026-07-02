// /destinations — Server Component. Reads the destinations collection from
// Firestore and links each to a filtered hotels search.

import type { Metadata } from "next";
import Image from "next/image";
import TrackedLink from "@/components/analytics/TrackedLink";
import { getDestinations } from "@/services/destinations";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse Naviora destinations — Goa, Jaipur, Dubai, Tokyo and more — and find hotels in each.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Destinations
      </h1>
      <p className="mt-2 text-slate-600">
        Explore {destinations.length} destinations and find your next stay.
      </p>

      {destinations.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <TrackedLink
              key={dest.id}
              href={`${ROUTES.hotels}?destination=${encodeURIComponent(dest.name)}`}
              event="select_destination"
              params={{ destination: dest.name, from: "destinations" }}
              className="group relative block h-56 overflow-hidden rounded-2xl"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <div className="text-xs font-medium text-white/80">
                  {dest.country}
                </div>
                <div className="text-xl font-bold">{dest.name}</div>
                <div className="text-sm text-white/90">{dest.tagline}</div>
                <div className="mt-1 text-xs text-white/80">
                  {dest.hotelCount}{" "}
                  {dest.hotelCount === 1 ? "stay" : "stays"}
                </div>
              </div>
            </TrackedLink>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-lg font-medium text-slate-700">
            No destinations yet.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Seed the database at{" "}
            <code className="rounded bg-slate-200 px-1">/api/seed</code>.
          </p>
        </div>
      )}
    </div>
  );
}
