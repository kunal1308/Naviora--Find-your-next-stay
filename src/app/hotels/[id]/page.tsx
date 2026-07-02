// /hotels/[id] — dynamic route, Server Component.
//
// Next.js 16 notes:
//   • `params` is a Promise → await it.
//   • generateMetadata gives each hotel its own <title>/description for SEO.
//   • generateStaticParams pre-renders a page per hotel at build time.
//   • notFound() renders the sibling not-found.tsx.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHotelById, getHotels } from "@/services/hotels";
import { getReviewsByHotelId } from "@/services/reviews";
import { ROUTES, AMENITY_MAP } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";
import BookingWidget from "@/features/hotels/components/BookingWidget";
import WishlistButton from "@/features/wishlist/components/WishlistButton";
import ViewHotelTracker from "@/features/hotels/components/ViewHotelTracker";
import HotelGallery from "@/features/hotels/components/HotelGallery";

type Params = Promise<{ id: string }>;

// Pre-render one static page per hotel at build time.
export async function generateStaticParams() {
  const hotels = await getHotels();
  return hotels.map((hotel) => ({ id: hotel.id }));
}

// Per-hotel SEO metadata.
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const hotel = await getHotelById(id);
  if (!hotel) return { title: "Hotel not found" };
  return {
    title: hotel.name,
    description: hotel.description,
  };
}

export default async function HotelDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const hotel = await getHotelById(id);

  // No hotel → render not-found.tsx and stop.
  if (!hotel) notFound();

  const reviews = await getReviewsByHotelId(id);

  return (
    <div className="mx-auto max-w-[96rem] px-4 py-8 sm:px-6">
      <ViewHotelTracker hotelId={hotel.id} name={hotel.name} />
      <Link
        href={ROUTES.hotels}
        className="text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← Back to hotels
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {hotel.name}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span>
            📍 {hotel.destination}, {hotel.country}
          </span>
          <span aria-hidden>·</span>
          <span className="font-medium text-slate-800">
            ★ {hotel.rating}{" "}
            <span className="font-normal text-slate-500">
              ({hotel.reviewCount} reviews)
            </span>
          </span>
        </div>
        </div>
        <WishlistButton
          hotelId={hotel.id}
          className="h-11 w-11 shrink-0 border border-slate-200 text-xl"
        />
      </div>

      {/* Gallery — taller, click any photo to open the lightbox */}
      <HotelGallery images={hotel.images} name={hotel.name} />

      {/* Body: content + sticky booking sidebar */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              About this stay
            </h2>
            <p className="mt-2 leading-relaxed text-slate-700">
              {hotel.description}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Sleeps up to {hotel.maxGuests} guests.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {hotel.amenities.map((amenityId) => {
                const amenity = AMENITY_MAP[amenityId];
                return (
                  <li
                    key={amenityId}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <span>{amenity.icon}</span>
                    {amenity.label}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Reviews{" "}
              <span className="text-base font-normal text-slate-500">
                ({reviews.length})
              </span>
            </h2>

            {reviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">
                        {review.author}
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {"★".repeat(review.rating)}
                        <span className="text-slate-300">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No reviews yet — be the first to stay and share your experience.
              </p>
            )}
          </section>
        </div>

        {/* Sticky booking widget (client island) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <BookingWidget hotel={hotel} />
          <p className="mt-3 text-center text-xs text-slate-400">
            {formatCurrency(hotel.pricePerNight, hotel.currency)} base rate ·
            free cancellation
          </p>
        </aside>
      </div>
    </div>
  );
}
