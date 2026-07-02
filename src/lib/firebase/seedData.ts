// One-time seed data for Firestore. Consumed only by the /api/seed route.
//
// Images are stored as URLs (picsum placeholders for now; swap for Cloudinary
// later). The original 8 hotels keep their exact ids so existing bookings /
// wishlists still resolve; the extra ~32 are generated with slugified ids.

import type { Destination, Hotel, Review } from "@/types";
import { slugify } from "@/utils";

// Deterministic placeholder image (same seed → same photo).
const img = (seed: string, n = 1) =>
  `https://picsum.photos/seed/${seed}-${n}/800/600`;

// The original curated hotels — ids kept stable on purpose.
const CURATED: Hotel[] = [
  {
    id: "azure-sands-goa",
    slug: "azure-sands-resort",
    name: "Azure Sands Resort",
    destination: "Goa",
    country: "India",
    description:
      "Beachfront resort with infinity pools, sunset views, and easy access to North Goa's nightlife.",
    pricePerNight: 6200,
    currency: "INR",
    rating: 4.6,
    reviewCount: 214,
    images: [img("azure-sands", 1), img("azure-sands", 2), img("azure-sands", 3)],
    amenities: ["wifi", "pool", "beach", "restaurant", "ac", "breakfast"],
    maxGuests: 4,
    coordinates: { lat: 15.5989, lng: 73.7381 },
  },
  {
    id: "palm-cove-goa",
    slug: "palm-cove-retreat",
    name: "Palm Cove Retreat",
    destination: "Goa",
    country: "India",
    description:
      "Quiet boutique stay tucked among palm groves, a short walk from the beach.",
    pricePerNight: 4500,
    currency: "INR",
    rating: 4.3,
    reviewCount: 128,
    images: [img("palm-cove", 1), img("palm-cove", 2), img("palm-cove", 3)],
    amenities: ["wifi", "pool", "breakfast", "parking", "petFriendly"],
    maxGuests: 3,
    coordinates: { lat: 15.552, lng: 73.7517 },
  },
  {
    id: "royal-amber-jaipur",
    slug: "the-royal-amber-palace",
    name: "The Royal Amber Palace",
    destination: "Jaipur",
    country: "India",
    description:
      "Heritage palace hotel with hand-painted suites, courtyards, and a rooftop restaurant.",
    pricePerNight: 8900,
    currency: "INR",
    rating: 4.8,
    reviewCount: 342,
    images: [img("royal-amber", 1), img("royal-amber", 2), img("royal-amber", 3)],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "parking"],
    maxGuests: 2,
    coordinates: { lat: 26.9855, lng: 75.8513 },
  },
  {
    id: "pinecrest-manali",
    slug: "pinecrest-mountain-lodge",
    name: "Pinecrest Mountain Lodge",
    destination: "Manali",
    country: "India",
    description:
      "Cozy timber lodge with valley views, fireplaces, and easy access to snow trails.",
    pricePerNight: 5200,
    currency: "INR",
    rating: 4.5,
    reviewCount: 176,
    images: [img("pinecrest", 1), img("pinecrest", 2), img("pinecrest", 3)],
    amenities: ["wifi", "breakfast", "parking", "restaurant", "petFriendly"],
    maxGuests: 5,
    coordinates: { lat: 32.2396, lng: 77.1887 },
  },
  {
    id: "marina-skyline-dubai",
    slug: "marina-skyline-suites",
    name: "Marina Skyline Suites",
    destination: "Dubai",
    country: "UAE",
    description:
      "High-rise suites overlooking Dubai Marina with a rooftop infinity pool and spa.",
    pricePerNight: 720,
    currency: "AED",
    rating: 4.7,
    reviewCount: 401,
    images: [img("marina", 1), img("marina", 2), img("marina", 3)],
    amenities: ["wifi", "pool", "gym", "spa", "restaurant", "ac"],
    maxGuests: 4,
    coordinates: { lat: 25.0805, lng: 55.1403 },
  },
  {
    id: "garden-bay-singapore",
    slug: "garden-bay-hotel",
    name: "Garden Bay Hotel",
    destination: "Singapore",
    country: "Singapore",
    description:
      "Modern city hotel steps from Gardens by the Bay, with skyline dining and a lap pool.",
    pricePerNight: 260,
    currency: "SGD",
    rating: 4.6,
    reviewCount: 289,
    images: [img("garden-bay", 1), img("garden-bay", 2), img("garden-bay", 3)],
    amenities: ["wifi", "pool", "gym", "restaurant", "ac", "breakfast"],
    maxGuests: 3,
    coordinates: { lat: 1.2816, lng: 103.8636 },
  },
  {
    id: "sakura-downtown-tokyo",
    slug: "sakura-downtown-inn",
    name: "Sakura Downtown Inn",
    destination: "Tokyo",
    country: "Japan",
    description:
      "Compact, design-forward rooms in Shinjuku, minutes from transit and nightlife.",
    pricePerNight: 21000,
    currency: "JPY",
    rating: 4.4,
    reviewCount: 233,
    images: [img("sakura", 1), img("sakura", 2), img("sakura", 3)],
    amenities: ["wifi", "ac", "restaurant", "gym"],
    maxGuests: 2,
    coordinates: { lat: 35.6938, lng: 139.7034 },
  },
  {
    id: "lakeview-udaipur",
    slug: "lakeview-heritage-haveli",
    name: "Lakeview Heritage Haveli",
    destination: "Udaipur",
    country: "India",
    description:
      "Restored haveli on Lake Pichola with arched balconies and traditional Rajasthani dining.",
    pricePerNight: 7400,
    currency: "INR",
    rating: 4.9,
    reviewCount: 198,
    images: [img("lakeview", 1), img("lakeview", 2), img("lakeview", 3)],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "breakfast"],
    maxGuests: 3,
    coordinates: { lat: 24.5714, lng: 73.6797 },
  },
];

// Compact seed for the additional hotels.
interface HotelSeed {
  name: string;
  destination: string;
  country: string;
  currency: string;
  price: number;
  rating: number;
  reviews: number;
  maxGuests: number;
  amenities: Hotel["amenities"];
  lat: number;
  lng: number;
  description?: string;
}

function build(s: HotelSeed): Hotel {
  const id = slugify(s.name);
  return {
    id,
    slug: id,
    name: s.name,
    destination: s.destination,
    country: s.country,
    description:
      s.description ??
      `A comfortable stay in ${s.destination}, ${s.country}, close to the area's top attractions.`,
    pricePerNight: s.price,
    currency: s.currency,
    rating: s.rating,
    reviewCount: s.reviews,
    images: [img(id, 1), img(id, 2), img(id, 3)],
    amenities: s.amenities,
    maxGuests: s.maxGuests,
    coordinates: { lat: s.lat, lng: s.lng },
  };
}

const MORE_SEEDS: HotelSeed[] = [
  // Goa
  { name: "Coconut Grove Beach Resort", destination: "Goa", country: "India", currency: "INR", price: 5400, rating: 4.4, reviews: 156, maxGuests: 4, amenities: ["wifi", "pool", "beach", "restaurant", "ac"], lat: 15.51, lng: 73.83 },
  { name: "Sunset Bay Villas", destination: "Goa", country: "India", currency: "INR", price: 7800, rating: 4.7, reviews: 201, maxGuests: 6, amenities: ["wifi", "pool", "beach", "ac", "breakfast", "parking"], lat: 15.28, lng: 74.12 },
  { name: "Anjuna Backpackers", destination: "Goa", country: "India", currency: "INR", price: 1800, rating: 4.1, reviews: 98, maxGuests: 2, amenities: ["wifi", "ac", "restaurant"], lat: 15.57, lng: 73.74 },
  { name: "Baga Beach Hotel", destination: "Goa", country: "India", currency: "INR", price: 4200, rating: 4.2, reviews: 143, maxGuests: 3, amenities: ["wifi", "pool", "restaurant", "ac"], lat: 15.55, lng: 73.75 },

  // Jaipur
  { name: "Amber Fort View Hotel", destination: "Jaipur", country: "India", currency: "INR", price: 5600, rating: 4.5, reviews: 187, maxGuests: 3, amenities: ["wifi", "restaurant", "ac", "parking", "breakfast"], lat: 26.99, lng: 75.85 },
  { name: "Pink City Boutique", destination: "Jaipur", country: "India", currency: "INR", price: 3900, rating: 4.3, reviews: 121, maxGuests: 2, amenities: ["wifi", "ac", "restaurant"], lat: 26.92, lng: 75.82 },
  { name: "Rajwada Grand", destination: "Jaipur", country: "India", currency: "INR", price: 9500, rating: 4.7, reviews: 264, maxGuests: 4, amenities: ["wifi", "pool", "spa", "restaurant", "ac", "parking"], lat: 26.91, lng: 75.79 },
  { name: "Hawa Mahal Residency", destination: "Jaipur", country: "India", currency: "INR", price: 3200, rating: 4.0, reviews: 89, maxGuests: 2, amenities: ["wifi", "ac", "breakfast"], lat: 26.92, lng: 75.83 },
  { name: "Jal Mahal Retreat", destination: "Jaipur", country: "India", currency: "INR", price: 7100, rating: 4.6, reviews: 176, maxGuests: 3, amenities: ["wifi", "pool", "restaurant", "ac", "spa"], lat: 26.95, lng: 75.85 },

  // Manali
  { name: "Solang Valley Resort", destination: "Manali", country: "India", currency: "INR", price: 6100, rating: 4.6, reviews: 198, maxGuests: 5, amenities: ["wifi", "restaurant", "parking", "breakfast"], lat: 32.31, lng: 77.15 },
  { name: "Beas River Cottages", destination: "Manali", country: "India", currency: "INR", price: 4400, rating: 4.3, reviews: 112, maxGuests: 4, amenities: ["wifi", "breakfast", "parking", "petFriendly"], lat: 32.24, lng: 77.19 },
  { name: "Old Manali Inn", destination: "Manali", country: "India", currency: "INR", price: 2600, rating: 4.1, reviews: 76, maxGuests: 2, amenities: ["wifi", "restaurant", "ac"], lat: 32.26, lng: 77.18 },
  { name: "Himalayan Heights Lodge", destination: "Manali", country: "India", currency: "INR", price: 5300, rating: 4.5, reviews: 143, maxGuests: 6, amenities: ["wifi", "restaurant", "parking", "breakfast", "spa"], lat: 32.28, lng: 77.17 },

  // Dubai
  { name: "Palm Jumeirah Resort", destination: "Dubai", country: "UAE", currency: "AED", price: 950, rating: 4.8, reviews: 512, maxGuests: 4, amenities: ["wifi", "pool", "beach", "spa", "gym", "restaurant", "ac"], lat: 25.11, lng: 55.14 },
  { name: "Downtown Burj Suites", destination: "Dubai", country: "UAE", currency: "AED", price: 810, rating: 4.7, reviews: 388, maxGuests: 3, amenities: ["wifi", "pool", "gym", "restaurant", "ac"], lat: 25.19, lng: 55.27 },
  { name: "Desert Rose Hotel", destination: "Dubai", country: "UAE", currency: "AED", price: 540, rating: 4.4, reviews: 221, maxGuests: 4, amenities: ["wifi", "pool", "restaurant", "ac", "parking"], lat: 25.08, lng: 55.2 },
  { name: "Deira Boutique Stay", destination: "Dubai", country: "UAE", currency: "AED", price: 380, rating: 4.2, reviews: 154, maxGuests: 2, amenities: ["wifi", "ac", "restaurant"], lat: 25.27, lng: 55.31 },
  { name: "JBR Beachfront", destination: "Dubai", country: "UAE", currency: "AED", price: 720, rating: 4.6, reviews: 297, maxGuests: 4, amenities: ["wifi", "pool", "beach", "gym", "ac"], lat: 25.08, lng: 55.13 },

  // Singapore
  { name: "Orchard Road Suites", destination: "Singapore", country: "Singapore", currency: "SGD", price: 320, rating: 4.7, reviews: 341, maxGuests: 3, amenities: ["wifi", "pool", "gym", "restaurant", "ac"], lat: 1.3, lng: 103.83 },
  { name: "Sentosa Cove Resort", destination: "Singapore", country: "Singapore", currency: "SGD", price: 410, rating: 4.8, reviews: 402, maxGuests: 4, amenities: ["wifi", "pool", "beach", "spa", "restaurant", "ac"], lat: 1.25, lng: 103.83 },
  { name: "Chinatown Boutique", destination: "Singapore", country: "Singapore", currency: "SGD", price: 210, rating: 4.3, reviews: 176, maxGuests: 2, amenities: ["wifi", "ac", "restaurant"], lat: 1.28, lng: 103.84 },
  { name: "Marina Bay View", destination: "Singapore", country: "Singapore", currency: "SGD", price: 380, rating: 4.6, reviews: 288, maxGuests: 3, amenities: ["wifi", "pool", "gym", "ac", "restaurant"], lat: 1.28, lng: 103.86 },

  // Tokyo
  { name: "Shibuya Crossing Hotel", destination: "Tokyo", country: "Japan", currency: "JPY", price: 24000, rating: 4.6, reviews: 312, maxGuests: 2, amenities: ["wifi", "ac", "restaurant", "gym"], lat: 35.66, lng: 139.7 },
  { name: "Asakusa Ryokan", destination: "Tokyo", country: "Japan", currency: "JPY", price: 18000, rating: 4.7, reviews: 244, maxGuests: 3, amenities: ["wifi", "ac", "restaurant", "spa"], lat: 35.71, lng: 139.8 },
  { name: "Ginza Luxury Suites", destination: "Tokyo", country: "Japan", currency: "JPY", price: 32000, rating: 4.8, reviews: 401, maxGuests: 3, amenities: ["wifi", "ac", "restaurant", "gym", "spa"], lat: 35.67, lng: 139.76 },
  { name: "Akihabara Capsule", destination: "Tokyo", country: "Japan", currency: "JPY", price: 9000, rating: 4.1, reviews: 132, maxGuests: 1, amenities: ["wifi", "ac"], lat: 35.7, lng: 139.77 },
  { name: "Ueno Park Inn", destination: "Tokyo", country: "Japan", currency: "JPY", price: 15000, rating: 4.3, reviews: 167, maxGuests: 2, amenities: ["wifi", "ac", "restaurant", "breakfast"], lat: 35.71, lng: 139.77 },

  // Udaipur
  { name: "City Palace Heritage", destination: "Udaipur", country: "India", currency: "INR", price: 8600, rating: 4.8, reviews: 231, maxGuests: 3, amenities: ["wifi", "pool", "spa", "restaurant", "ac"], lat: 24.58, lng: 73.68 },
  { name: "Fateh Sagar Retreat", destination: "Udaipur", country: "India", currency: "INR", price: 5900, rating: 4.5, reviews: 154, maxGuests: 4, amenities: ["wifi", "pool", "restaurant", "ac", "breakfast"], lat: 24.6, lng: 73.68 },
  { name: "Pichola Lake Resort", destination: "Udaipur", country: "India", currency: "INR", price: 7200, rating: 4.6, reviews: 189, maxGuests: 3, amenities: ["wifi", "pool", "restaurant", "ac", "spa"], lat: 24.57, lng: 73.68 },
  { name: "Sajjangarh Villas", destination: "Udaipur", country: "India", currency: "INR", price: 4800, rating: 4.3, reviews: 108, maxGuests: 4, amenities: ["wifi", "restaurant", "ac", "parking"], lat: 24.6, lng: 73.71 },
  { name: "Old City Haveli", destination: "Udaipur", country: "India", currency: "INR", price: 3400, rating: 4.2, reviews: 87, maxGuests: 2, amenities: ["wifi", "ac", "breakfast"], lat: 24.58, lng: 73.69 },
];

export const HOTELS: Hotel[] = [...CURATED, ...MORE_SEEDS.map(build)];

// Number of hotels per destination, derived from HOTELS so counts stay honest.
const hotelCountFor = (name: string) =>
  HOTELS.filter((h) => h.destination === name).length;

export const DESTINATIONS: Destination[] = [
  { id: "goa", slug: "goa", name: "Goa", country: "India", tagline: "Beaches & nightlife", image: img("dest-goa"), hotelCount: hotelCountFor("Goa") },
  { id: "jaipur", slug: "jaipur", name: "Jaipur", country: "India", tagline: "Palaces & heritage", image: img("dest-jaipur"), hotelCount: hotelCountFor("Jaipur") },
  { id: "manali", slug: "manali", name: "Manali", country: "India", tagline: "Mountains & snow", image: img("dest-manali"), hotelCount: hotelCountFor("Manali") },
  { id: "dubai", slug: "dubai", name: "Dubai", country: "UAE", tagline: "Luxury & skylines", image: img("dest-dubai"), hotelCount: hotelCountFor("Dubai") },
  { id: "singapore", slug: "singapore", name: "Singapore", country: "Singapore", tagline: "Gardens & food", image: img("dest-singapore"), hotelCount: hotelCountFor("Singapore") },
  { id: "tokyo", slug: "tokyo", name: "Tokyo", country: "Japan", tagline: "Culture & neon", image: img("dest-tokyo"), hotelCount: hotelCountFor("Tokyo") },
  { id: "udaipur", slug: "udaipur", name: "Udaipur", country: "India", tagline: "Lakes & havelis", image: img("dest-udaipur"), hotelCount: hotelCountFor("Udaipur") },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    hotelId: "azure-sands-goa",
    author: "Priya S.",
    rating: 5,
    comment:
      "Woke up to the sound of waves every morning. The infinity pool at sunset is unreal.",
    createdAt: "2026-05-18",
  },
  {
    id: "r2",
    hotelId: "azure-sands-goa",
    author: "Daniel K.",
    rating: 4,
    comment: "Great location and friendly staff. Breakfast could have more variety.",
    createdAt: "2026-04-02",
  },
  {
    id: "r3",
    hotelId: "royal-amber-jaipur",
    author: "Anita R.",
    rating: 5,
    comment:
      "Felt like royalty. The hand-painted suite and rooftop dinner were the highlight of our trip.",
    createdAt: "2026-06-11",
  },
  {
    id: "r4",
    hotelId: "royal-amber-jaipur",
    author: "Marco V.",
    rating: 5,
    comment: "Incredible heritage property. Worth every rupee.",
    createdAt: "2026-03-27",
  },
  {
    id: "r5",
    hotelId: "marina-skyline-dubai",
    author: "Sara L.",
    rating: 4,
    comment: "Stunning marina views and a fantastic spa. Rooms are a touch small.",
    createdAt: "2026-05-30",
  },
];
