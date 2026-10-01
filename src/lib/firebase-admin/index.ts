// Firebase Admin SDK — SERVER ONLY. Uses a service-account key, so this must
// only be imported from route handlers, never from a client component. It does
// what the browser SDK can't, like disabling another user's account.
//
// Setup: Firebase console → Project settings → Service accounts → Generate new
// private key, then put the whole JSON file's contents in
// FIREBASE_SERVICE_ACCOUNT (.env.local and Vercel env vars).

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth, type DecodedIdToken } from "firebase-admin/auth";
import { isAdmin } from "@/constants";

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT ?? "";

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(SERVICE_ACCOUNT);
}

// Reuse the app across hot reloads instead of re-initializing.
export function adminAuth(): Auth {
  const app = getApps().length
    ? getApp()
    : initializeApp({ credential: cert(JSON.parse(SERVICE_ACCOUNT)) });
  return getAuth(app);
}

// Returns the caller's decoded token if the request carries a valid
// `Authorization: Bearer <Firebase ID token>` for the verified admin email,
// otherwise null. checkRevoked rejects sessions that were signed out.
export async function verifyAdminRequest(
  request: Request,
): Promise<DecodedIdToken | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  try {
    const decoded = await adminAuth().verifyIdToken(token, true);
    return decoded.email_verified && isAdmin(decoded.email) ? decoded : null;
  } catch {
    return null;
  }
}
