// Bookings data-access. New bookings are created here; a user reads their own.

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking } from "@/types";

function toBooking(id: string, data: DocumentData): Booking {
  return { ...(data as Omit<Booking, "id">), id };
}

export async function createBooking(
  data: Omit<Booking, "id">,
): Promise<string> {
  const ref = await addDoc(collection(db, "bookings"), data);
  return ref.id;
}

export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  // Sort newest-first in memory (avoids needing a composite Firestore index).
  return snapshot.docs
    .map((d) => toBooking(d.id, d.data()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// Returns the user's upcoming/ongoing confirmed booking for a hotel, if any
// (checkout still in the future). Used to warn before creating a duplicate.
export async function getActiveBookingForHotel(
  userId: string,
  hotelId: string,
): Promise<Booking | null> {
  const all = await getBookingsByUser(userId);
  const now = Date.now();
  return (
    all.find(
      (b) =>
        b.hotelId === hotelId &&
        b.status === "confirmed" &&
        new Date(b.checkOut).getTime() >= now,
    ) ?? null
  );
}

export async function updateBooking(
  id: string,
  data: Partial<Booking>,
): Promise<void> {
  await updateDoc(doc(db, "bookings", id), data);
}

export async function cancelBooking(id: string): Promise<void> {
  await updateDoc(doc(db, "bookings", id), { status: "cancelled" });
}

// Business rule: a booking can be edited or cancelled only while check-in is
// at least 1 day (24h) away. Enforced in the UI; Firestore rules enforce
// ownership. (A production app would enforce the time rule server-side too.)
export function canModifyBooking(checkIn: string): boolean {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return new Date(checkIn).getTime() - Date.now() >= ONE_DAY;
}
