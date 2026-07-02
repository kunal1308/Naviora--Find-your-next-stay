// Google Analytics (Firebase Analytics) setup logic — the non-React part.
// The React mount point lives in components/analytics/FirebaseAnalytics.tsx.
//
// Analytics only works in the browser and isn't supported everywhere (SSR,
// some privacy setups), so we guard on `window` and isSupported().

import { app } from "@/lib/firebase";
import {
  getAnalytics,
  isSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";

let analytics: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics; // already initialized
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
  return analytics;
}

// Fire a custom event (e.g. trackEvent("view_hotel", { hotelId })).
// Safe to call anywhere — it no-ops if analytics isn't available.
export async function trackEvent(
  name: string,
  params?: Record<string, unknown>,
): Promise<void> {
  const instance = await initAnalytics();
  if (instance) logEvent(instance, name, params);
}
