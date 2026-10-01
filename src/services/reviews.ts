// Reviews data-access — now backed by Firestore. Same signature as before.

import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking, Review } from "@/types";

function toReview(id: string, data: DocumentData): Review {
  return { ...(data as Omit<Review, "id">), id };
}

export async function getReviewsByHotelId(hotelId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("hotelId", "==", hotelId),
  );
  const snapshot = await getDocs(q);
  // Newest first (sorted in memory to avoid a composite index).
  return snapshot.docs
    .map((d) => toReview(d.id, d.data()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// The user's reviews keyed by booking id, so Profile can show which stays
// are already reviewed.
export async function getReviewsByUser(
  userId: string,
): Promise<Record<string, Review>> {
  const q = query(collection(db, "reviews"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const byBooking: Record<string, Review> = {};
  snapshot.docs.forEach((d) => {
    const review = toReview(d.id, d.data());
    if (review.bookingId) byBooking[review.bookingId] = review;
  });
  return byBooking;
}

// A guest can review a confirmed stay once it has ended.
export function canReviewBooking(booking: Booking): boolean {
  return (
    booking.status === "confirmed" &&
    new Date(booking.checkOut).getTime() <= Date.now()
  );
}

// Saves the review AND updates the hotel's average rating + review count in
// one transaction, so the two can never drift apart. The review id is the
// booking id (one review per stay). firestore.rules re-checks all of this.
export async function submitReview({
  booking,
  userId,
  author,
  rating,
  comment,
}: {
  booking: Booking;
  userId: string;
  author: string;
  rating: number;
  comment: string;
}): Promise<void> {
  const hotelRef = doc(db, "hotels", booking.hotelId);
  const reviewRef = doc(db, "reviews", booking.id);

  await runTransaction(db, async (tx) => {
    const hotelSnap = await tx.get(hotelRef);
    const reviewSnap = await tx.get(reviewRef);
    if (!hotelSnap.exists()) throw new Error("This hotel no longer exists.");
    if (reviewSnap.exists()) throw new Error("You've already reviewed this stay.");

    const oldRating = Number(hotelSnap.data().rating) || 0;
    const oldCount = Number(hotelSnap.data().reviewCount) || 0;
    const newCount = oldCount + 1;
    // Keep one decimal, like the ratings shown across the app.
    const newRating =
      Math.round(((oldRating * oldCount + rating) / newCount) * 10) / 10;

    tx.set(reviewRef, {
      hotelId: booking.hotelId,
      bookingId: booking.id,
      userId,
      author: author.slice(0, 100), // rules cap the name at 100 chars
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
    // lastReviewId lets the rules tie this update to the new review.
    tx.update(hotelRef, {
      rating: newRating,
      reviewCount: newCount,
      lastReviewId: booking.id,
    });
  });
}
