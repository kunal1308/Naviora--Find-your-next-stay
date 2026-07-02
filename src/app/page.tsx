// Home page — Server Component. Marketing UI + the interactive <SearchBar />.
// Design language borrowed from HomeSphere: full-bleed hero photo with a dark
// gradient overlay, glassy stat cards, rounded feature cards, and a gradient
// CTA band — rendered in Naviora's teal + slate palette.

import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/search/SearchBar";
import TrackedLink from "@/components/analytics/TrackedLink";
import { ROUTES } from "@/constants";

const STATS = [
  { value: "500+", label: "Curated stays" },
  { value: "40+", label: "Destinations" },
  { value: "4.8★", label: "Average rating" },
];

const FEATURES = [
  {
    icon: "🛎️",
    title: "Handpicked quality",
    body: "Every stay is reviewed by our team for location, comfort, and character.",
  },
  {
    icon: "💸",
    title: "Transparent pricing",
    body: "See the real nightly rate up front — no hidden fees at checkout.",
  },
  {
    icon: "⚡",
    title: "Instant booking",
    body: "Reserve in a few taps with instant confirmation and free cancellation.",
  },
];

const FEATURED = [
  { name: "Goa", tagline: "Beaches & nightlife", emoji: "🏖️" },
  { name: "Jaipur", tagline: "Palaces & heritage", emoji: "🏰" },
  { name: "Manali", tagline: "Mountains & snow", emoji: "🏔️" },
  { name: "Dubai", tagline: "Luxury & skylines", emoji: "🌆" },
  { name: "Singapore", tagline: "Gardens & food", emoji: "🌸" },
  { name: "Tokyo", tagline: "Culture & neon", emoji: "🗼" },
];

// Inspiration gallery (placeholder photos; swap for Cloudinary later).
const GALLERY = [
  { seed: "naviora-goa", label: "Goa" },
  { seed: "naviora-jaipur", label: "Jaipur" },
  { seed: "naviora-manali", label: "Manali" },
  { seed: "naviora-udaipur", label: "Udaipur" },
  { seed: "naviora-dubai", label: "Dubai" },
  { seed: "naviora-singapore", label: "Singapore" },
  { seed: "naviora-tokyo", label: "Tokyo" },
  { seed: "naviora-paris", label: "Paris" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative bg-slate-900 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.82), rgba(15,118,110,0.85)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
        }}
      >
        <div className="mx-auto max-w-[96rem] px-4 py-24 sm:px-6 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              ✦ Handpicked stays, worldwide
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Find your next stay with Naviora
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
              Discover beautiful hotels across the world&apos;s best
              destinations — search, compare, and book in minutes.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBar />
            </div>
          </div>

          {/* Glassy stat cards */}
          <div className="mt-12 flex flex-wrap gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 px-6 py-4 text-white backdrop-blur"
              >
                <div className="text-3xl font-extrabold">{s.value}</div>
                <div className="text-sm text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NAVIORA */}
      <section className="mx-auto max-w-[96rem] px-4 py-16 sm:px-6 md:py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Why Naviora?
        </h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[96rem] px-4 py-16 sm:px-6 md:py-20">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Popular destinations
            </h2>
            <Link
              href={ROUTES.destinations}
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURED.map((place) => (
              <TrackedLink
                key={place.name}
                href={`${ROUTES.hotels}?destination=${encodeURIComponent(place.name)}`}
                event="select_destination"
                params={{ destination: place.name, from: "home" }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <div className="text-4xl">{place.emoji}</div>
                <div className="mt-3 font-semibold text-slate-900 group-hover:text-brand-700">
                  {place.name}
                </div>
                <div className="text-xs text-slate-500">{place.tagline}</div>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="mx-auto max-w-[96rem] px-4 py-16 sm:px-6 md:py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Get inspired
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          A glimpse of the stays and places waiting for you.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {GALLERY.map((photo) => (
            <div
              key={photo.seed}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={`https://picsum.photos/seed/${photo.seed}/600/450`}
                alt={photo.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                {photo.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-gradient-to-br from-slate-900 to-brand-700">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to find your next stay?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/90">
            Browse handpicked hotels across the world&apos;s best destinations
            and book in minutes.
          </p>
          <Link
            href={ROUTES.hotels}
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-slate-100"
          >
            Browse hotels
          </Link>
        </div>
      </section>
    </>
  );
}
