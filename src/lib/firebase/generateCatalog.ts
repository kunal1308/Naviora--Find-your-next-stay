// Randomized demo-data generator. ADD-ONLY: each call produces NEW hotels with
// unique ids so seeding appends to the catalog instead of replacing it.
// Only currencies present in INR_RATES are used so price filtering stays correct.

import type { Destination, Hotel, Review } from "@/types";
import { AMENITIES } from "@/constants";
import { INR_RATES } from "@/constants/currency";
import { slugify, toINR } from "@/utils";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const pick = <T,>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];
const sample = <T,>(arr: readonly T[], n: number): T[] =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const token = () => Math.random().toString(36).slice(2, 8);

// Razorpay TEST mode rejects large transactions ("amount exceeds maximum").
// Foreign-currency hotels (USD/EUR/etc.) convert to big INR totals, so we cap
// each nightly rate to this INR-equivalent and back-convert to the hotel's
// native currency. Change this one number to tune how payable stays are.
export const TEST_MAX_INR_PER_NIGHT = 5000;

export function capPriceNative(
  pricePerNight: number,
  currency: string,
): number {
  if (toINR(pricePerNight, currency) <= TEST_MAX_INR_PER_NIGHT) {
    return pricePerNight;
  }
  const rate = INR_RATES[currency] ?? 1;
  return Math.round(TEST_MAX_INR_PER_NIGHT / rate);
}

interface DestSeed {
  name: string;
  country: string;
  currency: string;
  lat: number;
  lng: number;
  tagline: string;
  price: [number, number];
}

const DEST_POOL: DestSeed[] = [
  { name: "Goa", country: "India", currency: "INR", lat: 15.49, lng: 73.83, tagline: "Beaches & nightlife", price: [1500, 5000] },
  { name: "Jaipur", country: "India", currency: "INR", lat: 26.92, lng: 75.82, tagline: "Palaces & heritage", price: [1800, 5000] },
  { name: "Manali", country: "India", currency: "INR", lat: 32.24, lng: 77.19, tagline: "Mountains & snow", price: [1200, 4200] },
  { name: "Udaipur", country: "India", currency: "INR", lat: 24.58, lng: 73.68, tagline: "Lakes & havelis", price: [2000, 5000] },
  { name: "Kerala", country: "India", currency: "INR", lat: 9.93, lng: 76.27, tagline: "Backwaters & greenery", price: [1600, 4800] },
  { name: "Dubai", country: "UAE", currency: "AED", lat: 25.2, lng: 55.27, tagline: "Luxury & skylines", price: [110, 210] },
  { name: "Singapore", country: "Singapore", currency: "SGD", lat: 1.29, lng: 103.85, tagline: "Gardens & food", price: [40, 78] },
  { name: "Tokyo", country: "Japan", currency: "JPY", lat: 35.68, lng: 139.76, tagline: "Culture & neon", price: [3500, 9000] },
  { name: "Paris", country: "France", currency: "EUR", lat: 48.85, lng: 2.35, tagline: "Art & cafés", price: [28, 55] },
  { name: "New York", country: "USA", currency: "USD", lat: 40.71, lng: -74.0, tagline: "The city that never sleeps", price: [32, 60] },
];

const ADJ = ["Azure", "Royal", "Grand", "Sunset", "Palm", "Ocean", "Coral", "Pine", "Lotus", "Amber", "Serene", "Golden", "Emerald", "Crystal", "Skyline"];
const NOUN = ["Resort", "Suites", "Retreat", "Lodge", "Inn", "Hotel", "Villas", "Haveli", "Palace", "Boutique", "Residency", "Bay", "Heights", "Gardens", "House"];
const COMMENTS = [
  "Great stay — would happily return.",
  "Lovely views and friendly staff.",
  "Clean rooms and a superb location.",
  "A little pricey, but worth it.",
  "Comfortable, quiet, and well-kept.",
];
const AUTHORS = ["Priya S.", "Daniel K.", "Anita R.", "Marco V.", "Sara L.", "Ken T.", "Meera J.", "Liam O."];

// Generate `count` brand-new hotels with unique ids (safe to append repeatedly).
export function generateHotels(count = 10): Hotel[] {
  const amenityIds = AMENITIES.map((a) => a.id);
  const batch = token();
  return Array.from({ length: count }, (_, i) => {
    const dest = pick(DEST_POOL);
    const id = `gen-${batch}-${i}`;
    const name = `${pick(ADJ)} ${pick(NOUN)}`;
    return {
      id,
      slug: `${slugify(name)}-${batch}-${i}`,
      name,
      destination: dest.name,
      country: dest.country,
      description: `A comfortable stay in ${dest.name}, ${dest.country}, close to the area's highlights.`,
      pricePerNight: capPriceNative(
        randInt(dest.price[0], dest.price[1]),
        dest.currency,
      ),
      currency: dest.currency,
      rating: Math.round(rand(3.8, 4.9) * 10) / 10,
      reviewCount: randInt(30, 500),
      images: [
        `https://picsum.photos/seed/${id}-a/800/600`,
        `https://picsum.photos/seed/${id}-b/800/600`,
        `https://picsum.photos/seed/${id}-c/800/600`,
      ],
      amenities: sample(amenityIds, randInt(3, 6)) as Hotel["amenities"],
      maxGuests: randInt(2, 6),
      coordinates: {
        lat: dest.lat + rand(-0.05, 0.05),
        lng: dest.lng + rand(-0.05, 0.05),
      },
    };
  });
}

// A few reviews for the freshly added hotels (unique ids).
export function generateReviews(hotels: Hotel[], count = 6): Review[] {
  if (!hotels.length) return [];
  const batch = token();
  return Array.from({ length: count }, (_, i) => {
    const h = pick(hotels);
    return {
      id: `rev-${batch}-${i}`,
      hotelId: h.id,
      author: pick(AUTHORS),
      rating: randInt(3, 5),
      comment: pick(COMMENTS),
      createdAt: "2026-06-01",
    };
  });
}

// Build the 10 destination docs, with counts computed from ALL current hotels.
export function buildDestinations(allHotels: Hotel[]): Destination[] {
  return DEST_POOL.map((d) => ({
    id: slugify(d.name),
    slug: slugify(d.name),
    name: d.name,
    country: d.country,
    tagline: d.tagline,
    image: `https://picsum.photos/seed/dest-${slugify(d.name)}/800/600`,
    hotelCount: allHotels.filter((h) => h.destination === d.name).length,
  }));
}
