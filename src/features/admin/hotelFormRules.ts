// Validation + ID helpers for HotelForm (used by /admin and /host).

import { slugify } from "@/utils";

export interface HotelFormValues {
  name: string;
  destination: string;
  country: string;
  description: string;
  pricePerNight: string;
  maxGuests: string;
  images: string[];
}

// Every field except amenities is required. Returns the first problem, in
// form order, or null when the form is valid. (Rating and review count aren't
// in the form; they come from guest reviews.)
export function validateHotelForm(v: HotelFormValues): string | null {
  if (!v.name.trim()) return "Name is required.";
  if (!v.destination.trim()) return "Destination is required.";
  if (!v.country.trim()) return "Country is required.";
  if (!v.description.trim()) return "Description is required.";

  const price = Number(v.pricePerNight);
  if (!v.pricePerNight.trim() || !Number.isFinite(price) || price <= 0) {
    return "Price per night must be greater than 0.";
  }

  const guests = Number(v.maxGuests);
  if (!v.maxGuests.trim() || !Number.isInteger(guests) || guests < 1) {
    return "Max guests must be greater than 0"
  }

  if (v.images.length === 0) return "Please upload at least one image.";

  return null;
}

// New hotel IDs get a random suffix so two hotels with the same name never
// share (and overwrite) a document. Names with no latin letters slugify to "",
// hence the "hotel" fallback.
export function newHotelId(name: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slugify(name) || "hotel"}-${suffix}`;
}
