"use client";

// Side-effect-only: logs a view_hotel event when a hotel detail page mounts.
// Rendered by the (server) detail page — a tiny client island just for tracking.

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ViewHotelTracker({
  hotelId,
  name,
}: {
  hotelId: string;
  name: string;
}) {
  useEffect(() => {
    void trackEvent("view_hotel", { item_id: hotelId, item_name: name });
  }, [hotelId, name]);

  return null;
}
