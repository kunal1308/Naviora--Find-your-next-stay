"use client";

// The /host dashboard body: the current user's own listings, with add / edit /
// delete. It's AdminHotelList scoped to ownerId === the signed-in user.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { getHotelsByOwner, deleteHotel } from "@/services/hotels";
import type { Hotel } from "@/types";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils";
import { useToast } from "@/components/ui/ToastProvider";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function HostListings() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<Hotel | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!user) return;
    let active = true;
    getHotelsByOwner(user.uid).then((list) => {
      if (active) {
        setHotels(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user]);

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteHotel(deleting.id);
      setHotels((prev) => prev.filter((h) => h.id !== deleting.id));
      toast.success(`Deleted "${deleting.name}".`);
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Your listings
          </h1>
          <p className="text-sm text-slate-500">
            {loading ? "Loading…" : `${hotels.length} listing(s)`}
          </p>
        </div>
        <Link
          href={ROUTES.hostNewHotel}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + List a property
        </Link>
      </div>

      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading listings…</div>
        ) : hotels.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">You haven&apos;t listed anything yet.</p>
            <Link
              href={ROUTES.hostNewHotel}
              className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              List your first property
            </Link>
          </div>
        ) : (
          hotels.map((hotel) => (
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
                  href={ROUTES.hostEditHotel(hotel.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleting(hotel)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleting && (
        <ConfirmDialog
          title="Delete listing?"
          danger
          confirmLabel="Delete"
          cancelLabel="Keep"
          loading={deleteBusy}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
          message={
            <>
              Delete{" "}
              <span className="font-medium text-slate-700">
                {deleting.name}
              </span>
              ? This cannot be undone.
            </>
          }
        />
      )}
    </div>
  );
}
