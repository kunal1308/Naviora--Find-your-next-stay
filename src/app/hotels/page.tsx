// /hotels — Server Component.
// Reads filters from the URL (searchParams is a Promise in Next 16 → await it),
// turns them into a HotelFilters object, and fetches filtered data. The client
// <HotelFilters /> sidebar only edits the URL; this page does the actual work.
//
//   URL (?minRating=4.5&amenities=pool,spa&sort=price-asc)
//     → this page parses it
//     → getHotels(filters)  (services/)
//     → HotelCard grid       (features/hotels/)

import type { Metadata } from "next";
import { getHotels, type HotelFilters } from "@/services/hotels";
import HotelResults from "@/features/hotels/components/HotelResults";
import HotelFiltersPanel from "@/features/hotels/components/HotelFilters";
import HotelSearch from "@/features/hotels/components/HotelSearch";

export const metadata: Metadata = {
  title: "Hotels",
  description:
    "Search and filter handpicked hotels across the world's best destinations on Naviora.",
};

type SearchParams = Promise<{
  destination?: string;
  search?: string;
  guests?: string;
  minRating?: string;
  amenities?: string;
  maxPrice?: string;
  sort?: string;
}>;

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const filters: HotelFilters = {
    destination: sp.destination,
    search: sp.search,
    minGuests: sp.guests ? Number(sp.guests) : undefined,
    minRating: sp.minRating ? Number(sp.minRating) : undefined,
    amenities: sp.amenities
      ? sp.amenities.split(",").filter(Boolean)
      : undefined,
    maxPriceINR: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort: sp.sort as HotelFilters["sort"],
  };

  const hotels = await getHotels(filters);

  return (
    <div className="mx-auto max-w-[96rem] px-4 py-10 sm:px-6">
      <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr]">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {sp.destination ? `Stays in ${sp.destination}` : "All hotels"}
        </h1>
        <div className="w-full sm:w-2/5">
          <HotelSearch />
        </div>
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        <HotelFiltersPanel />
        <HotelResults hotels={hotels} />
      </div>
    </div>
  );
}
