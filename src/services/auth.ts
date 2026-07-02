// Auth operations — thin wrappers over the Firebase Auth SDK.
// Components call these; they never import firebase/auth directly. If we ever
// swap providers, only this file changes.

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(cred.user, { displayName: name });
  }
  return cred.user;
}

export async function signIn(
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

// Subscribe to auth state changes; returns an unsubscribe function.
export function subscribeToAuth(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
