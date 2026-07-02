// Data-access layer — Firestore-backed, with filtering + sorting.
// Firestore can't do substring search or cross-currency price comparison, so
// we fetch the (small) collection and refine in memory. A large catalog would
// use a search index (Algolia/Typesense) instead.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Hotel } from "@/types";
import { toINR } from "@/utils";

function toHotel(id: string, data: DocumentData): Hotel {
  return { ...(data as Omit<Hotel, "id">), id };
}

export interface HotelFilters {
  destination?: string;
  search?: string;
  minGuests?: number;
  minRating?: number;
  amenities?: string[];
  maxPriceINR?: number;
  sort?: "rating" | "price-asc" | "price-desc";
}

export async function getHotels(filters: HotelFilters = {}): Promise<Hotel[]> {
  const { destination, search, minGuests, minRating, amenities, maxPriceINR, sort } =
    filters;

  const snapshot = await getDocs(collection(db, "hotels"));
  let results = snapshot.docs.map((d) => toHotel(d.id, d.data()));

  if (destination) {
    const q = destination.toLowerCase();
    results = results.filter(
      (h) =>
        h.destination.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q),
    );
  }

  if (search) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.destination.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q),
    );
  }

  if (minGuests) {
    results = results.filter((h) => h.maxGuests >= minGuests);
  }

  if (minRating) {
    results = results.filter((h) => h.rating >= minRating);
  }

  if (amenities?.length) {
    results = results.filter((h) =>
      amenities.every((a) => (h.amenities as string[]).includes(a)),
    );
  }

  if (maxPriceINR) {
    results = results.filter(
      (h) => toINR(h.pricePerNight, h.currency) <= maxPriceINR,
    );
  }

  switch (sort) {
    case "price-asc":
      results.sort(
        (a, b) =>
          toINR(a.pricePerNight, a.currency) - toINR(b.pricePerNight, b.currency),
      );
      break;
    case "price-desc":
      results.sort(
        (a, b) =>
          toINR(b.pricePerNight, b.currency) - toINR(a.pricePerNight, a.currency),
      );
      break;
    default:
      results.sort((a, b) => b.rating - a.rating);
  }

  return results;
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  const snapshot = await getDoc(doc(db, "hotels", id));
  return snapshot.exists() ? toHotel(snapshot.id, snapshot.data()) : null;
}

// A host's own listings.
export async function getHotelsByOwner(ownerId: string): Promise<Hotel[]> {
  const q = query(collection(db, "hotels"), where("ownerId", "==", ownerId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => toHotel(d.id, d.data()))
    .sort((a, b) => b.rating - a.rating);
}

// --- CRUD (writes gated by admin OR owner in firestore.rules) ---

export async function createHotel(hotel: Hotel): Promise<void> {
  await setDoc(doc(db, "hotels", hotel.id), hotel);
}

export async function updateHotel(
  id: string,
  data: Partial<Hotel>,
): Promise<void> {
  await updateDoc(doc(db, "hotels", id), data);
}

export async function deleteHotel(id: string): Promise<void> {
  await deleteDoc(doc(db, "hotels", id));
}
