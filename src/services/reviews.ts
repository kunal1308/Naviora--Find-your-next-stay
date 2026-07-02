// Reviews data-access — now backed by Firestore. Same signature as before.

import {
  collection,
  getDocs,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Review } from "@/types";

function toReview(id: string, data: DocumentData): Review {
  return { ...(data as Omit<Review, "id">), id };
}

export async function getReviewsByHotelId(hotelId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("hotelId", "==", hotelId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toReview(d.id, d.data()));
}
