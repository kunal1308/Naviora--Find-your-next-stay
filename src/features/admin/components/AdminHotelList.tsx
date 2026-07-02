"use client";

// Admin dashboard body: lists all hotels with edit + delete actions.
// Client Component because delete mutates and updates the list in place.

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHotels, deleteHotel } from "@/services/hotels";
import type { Hotel } from "@/types";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default function AdminHotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    getHotels().then((all) => {
      if (active) {
        setHotels(all);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(hotel: Hotel) {
    if (!confirm(`Delete "${hotel.name}"? This cannot be undone.`)) return;
    setBusyId(hotel.id);
    try {
      await deleteHotel(hotel.id);
      setHotels((prev) => prev.filter((h) => h.id !== hotel.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(hotels.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = hotels.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hotels
          </h1>
          <p className="text-sm text-slate-500">
            {loading ? "Loading…" : `${hotels.length} total`}
          </p>
        </div>
        <Link
          href={ROUTES.adminNewHotel}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add hotel
        </Link>
      </div>

      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading hotels…</div>
        ) : hotels.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No hotels yet.</div>
        ) : (
          pageItems.map((hotel) => (
            <div
              key={hotel.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <div className="font-medium text-slate-900">{hotel.name}</div>
                <div className="text-sm text-slate-500">
                  {hotel.destination}, {hotel.country} ·{" "}
                  {formatCurrency(hotel.pricePerNight, hotel.currency)} · ★{" "}
                  {hotel.rating}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.hotel(hotel.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  View
                </Link>
                <Link
                  href={ROUTES.adminEditHotel(hotel.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(hotel)}
                  disabled={busyId === hotel.id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  {busyId === hotel.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && (
        <Pagination page={current} totalPages={totalPages} onPage={setPage} />
      )}
    </div>
  );
}
