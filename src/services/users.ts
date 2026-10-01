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
import { auth, db } from "@/lib/firebase";
import { nameFromEmail } from "@/utils";

// Calls the admin-only /api/admin/users route with the signed-in admin's
// Firebase ID token (the server re-checks that the caller is the admin).
async function adminUsersApi<T>(init?: RequestInit): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again.");
  const res = await fetch("/api/admin/users", {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data as T;
}

// Admin: uids of accounts that are disabled (can't sign in).
export async function getDisabledUserIds(): Promise<Set<string>> {
  const { disabled } = await adminUsersApi<{ disabled: string[] }>();
  return new Set(disabled);
}

// Admin: disable (block sign-in) or re-enable an account. Their data is kept.
export async function setUserDisabled(
  uid: string,
  disabled: boolean,
): Promise<void> {
  await adminUsersApi({
    method: "POST",
    body: JSON.stringify({ uid, disabled }),
  });
}

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
