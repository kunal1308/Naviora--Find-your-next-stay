import type { AmenityId } from "@/constants/amenities";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  destination: string; // city, e.g. "Goa"
  country: string;
  description: string;
  pricePerNight: number;
  currency: string; // ISO 4217, e.g. "INR", "AED", "JPY"
  rating: number; // 0–5
  reviewCount: number;
  images: string[]; // urls (empty for now — we render placeholders)
  amenities: AmenityId[];
  maxGuests: number;
  coordinates: Coordinates;
  ownerId?: string; // set for host-listed hotels; absent for curated ones
}
