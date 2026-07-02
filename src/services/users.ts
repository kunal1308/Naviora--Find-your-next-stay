// User profile data-access. A user doc (users/{uid}) holds per-user data like
// the wishlist and avatar. We use setDoc(..., { merge: true }) so the doc is
// created on first write and existing fields are preserved.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { nameFromEmail } from "@/utils";

export interface UserRecord {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  wishlist?: string[];
}

// Upsert a user's profile doc on sign-in so every user is listable by admin.
export async function ensureUserProfile(
  uid: string,
  name: string | null,
  email: string | null,
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { name: name?.trim() || nameFromEmail(email), email: email ?? "" },
    { merge: true },
  );
}

// Admin-only in practice (firestore.rules restricts reading others' docs).
export async function getAllUsers(): Promise<UserRecord[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<UserRecord, "id">),
  }));
}

export async function getWishlist(uid: string): Promise<string[]> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ((snap.data().wishlist as string[]) ?? []) : [];
}

export async function addToWishlist(uid: string, hotelId: string): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { wishlist: arrayUnion(hotelId) },
    { merge: true },
  );
}

export async function removeFromWishlist(
  uid: string,
  hotelId: string,
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    { wishlist: arrayRemove(hotelId) },
    { merge: true },
  );
}

// Live updates — fires immediately and on every change to the user's wishlist.
export function subscribeWishlist(
  uid: string,
  callback: (ids: string[]) => void,
): () => void {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    callback(snap.exists() ? ((snap.data().wishlist as string[]) ?? []) : []);
  });
}

export async function updateAvatar(uid: string, avatarUrl: string): Promise<void> {
  await setDoc(doc(db, "users", uid), { avatarUrl }, { merge: true });
}

export async function getAvatar(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ((snap.data().avatarUrl as string) ?? null) : null;
}
