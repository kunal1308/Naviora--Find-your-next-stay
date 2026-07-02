"use client";

// Mounts once in the root layout. Two jobs:
//  1. Initialize analytics in the browser.
//  2. Log a page_view on every client-side route change — Firebase's auto
//     page_view only fires on the initial load, not on SPA navigations.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackEvent } from "@/lib/analytics";

export default function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    void initAnalytics();
  }, []);

  useEffect(() => {
    void trackEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
