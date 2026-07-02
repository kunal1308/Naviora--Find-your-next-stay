// Feature component: only the hotels feature uses it, so it lives inside
// features/hotels/, NOT the shared components/ folder.
// It's a Server Component (no interactivity) — pure presentation from props.

import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/types";
import { ROUTES, AMENITY_MAP } from "@/constants";
import { formatCurrency } from "@/utils";
import WishlistButton from "@/features/wishlist/components/WishlistButton";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link
      href={ROUTES.hotel(hotel.id)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
    >
      {/* Photo if present, otherwise a branded gradient with the initial */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-400 to-brand-700">
        {hotel.images[0] ? (
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-white/90">
            {hotel.name.charAt(0)}
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-slate-800">
          ★ {hotel.rating}
        </span>
        <WishlistButton
          hotelId={hotel.id}
          className="absolute left-3 top-3 h-8 w-8 text-lg"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs font-medium text-slate-500">
          {hotel.destination}, {hotel.country}
        </div>
        <h3 className="mt-0.5 font-semibold text-slate-900 group-hover:text-brand-700">
          {hotel.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {hotel.description}
        </p>

        {/* Amenity icons */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 5).map((id) => (
            <span
              key={id}
              title={AMENITY_MAP[id].label}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm"
            >
              {AMENITY_MAP[id].icon}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(hotel.pricePerNight, hotel.currency)}
            </span>
            <span className="text-sm text-slate-500"> / night</span>
          </div>
          <span className="text-xs text-slate-400">
            {hotel.reviewCount} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}
