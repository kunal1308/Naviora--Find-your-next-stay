// Auth operations — thin wrappers over the Firebase Auth SDK.
// Components call these; they never import firebase/auth directly. If we ever
// swap providers, only this file changes.

import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

// Thrown by signIn when the account's email isn't verified yet.
export const EMAIL_NOT_VERIFIED = "auth/email-not-verified";

// Creates the account, emails a verification link, then signs out so the
// account can't be used until the email is verified. Returns false if the
// link couldn't be sent (the user can resend it from sign in).
export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<boolean> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  let emailSent = true;
  try {
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    await sendEmailVerification(cred.user);
  } catch {
    emailSent = false;
  } finally {
    await signOut(auth);
  }
  return emailSent;
}

export async function signIn(
  email: string,
  password: string,
): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!cred.user.emailVerified) {
    await signOut(auth);
    throw new FirebaseError(EMAIL_NOT_VERIFIED, "Email not verified");
  }
  return cred.user;
}

// Re-send the verification link. Firebase needs a signed-in user for this, so
// sign in briefly and sign out again. Returns true if already verified.
export async function resendVerificationEmail(
  email: string,
  password: string,
): Promise<boolean> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  try {
    if (!cred.user.emailVerified) {
      await sendEmailVerification(cred.user);
    }
  } finally {
    await signOut(auth);
  }
  return cred.user.emailVerified;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export function signOutUser(): Promise<void> {
  return signOut(auth);
}

// Send a password-reset email. Firebase hosts the reset page and handles the
// actual password change — we just trigger the email.
export function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

// Subscribe to auth state changes; returns an unsubscribe function.
export function subscribeToAuth(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
