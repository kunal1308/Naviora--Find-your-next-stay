"use client";

// The /wishlist page body. It's a Client Component because the wishlist is
// per-user client state (from useWishlist). It fetches the hotel catalog once
// and shows the ones whose ids are saved.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { getHotels } from "@/services/hotels";
import type { Hotel } from "@/types";
import HotelCard from "@/features/hotels/components/HotelCard";
import { ROUTES } from "@/constants";

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
      <p className="text-lg font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
      <Link
        href={cta.href}
        className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {cta.label}
      </Link>
    </div>
  );
}

export default function WishlistList() {
  const { user, loading: authLoading } = useAuth();
  const { ids } = useWishlist();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (authLoading || loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to view your wishlist"
        body="Your saved stays sync across devices once you're signed in."
        cta={{ href: ROUTES.login, label: "Sign in" }}
      />
    );
  }

  const saved = hotels.filter((h) => ids.includes(h.id));

  if (saved.length === 0) {
    return (
      <EmptyState
        title="No saved stays yet"
        body="Tap the ♡ on any hotel to save it here."
        cta={{ href: ROUTES.hotels, label: "Browse hotels" }}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {saved.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
