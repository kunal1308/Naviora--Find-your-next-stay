"use client";

// Renders the hotel results grid with client-side pagination (9 per page).
// It also hides the viewer's own listings — you can't book your own property.
// The page number lives in the URL (?page=N) so it's shareable and survives
// refresh; filters reset it to page 1 (see HotelFilters).

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Hotel } from "@/types";
import HotelCard from "@/features/hotels/components/HotelCard";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/features/auth/AuthProvider";
import { ROUTES } from "@/constants";

const PAGE_SIZE = 9;

export default function HotelResults({ hotels }: { hotels: Hotel[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const visible = user
    ? hotels.filter((h) => h.ownerId !== user.uid)
    : hotels;

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = visible.slice(start, start + PAGE_SIZE);

  function goToPage(p: number) {
    const next = new URLSearchParams(params.toString());
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div>
      <p className="mb-5 text-lg font-semibold text-slate-900 sm:text-xl">
        {visible.length} {visible.length === 1 ? "stay" : "stays"} available
      </p>

      {visible.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={goToPage} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-lg font-medium text-slate-700">
            No stays match these filters.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try widening your price range or removing some amenities.
          </p>
          <Link
            href={ROUTES.hotels}
            className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Reset search
          </Link>
        </div>
      )}
    </div>
  );
}
