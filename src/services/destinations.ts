// Destinations data-access — Firestore-backed, same pattern as hotels/reviews.

import { collection, getDocs, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Destination } from "@/types";

function toDestination(id: string, data: DocumentData): Destination {
  return { ...(data as Omit<Destination, "id">), id };
}

export async function getDestinations(): Promise<Destination[]> {
  const snapshot = await getDocs(collection(db, "destinations"));
  return snapshot.docs
    .map((d) => toDestination(d.id, d.data()))
    .sort((a, b) => b.hotelCount - a.hotelCount);
}
