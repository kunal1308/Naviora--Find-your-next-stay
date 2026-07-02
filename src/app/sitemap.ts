import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants";
import { getHotels } from "@/services/hotels";

// Public, crawlable routes. Private routes (admin/host/profile/wishlist) are
// excluded here and blocked in robots.ts.
const STATIC_PATHS = [
  "",
  "/hotels",
  "/destinations",
  "/login",
  "/about",
  "/contact",
  "/help",
  "/cancellation",
  "/safety",
  "/reviews",
  "/careers",
  "/press",
  "/blog",
  "/terms",
  "/privacy",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  let hotelEntries: MetadataRoute.Sitemap = [];
  try {
    const hotels = await getHotels();
    hotelEntries = hotels.map((h) => ({
      url: `${SITE_URL}/hotels/${h.id}`,
      lastModified: now,
    }));
  } catch {
    // If the catalog can't be read at build time, ship the static sitemap only.
    hotelEntries = [];
  }

  return [...staticEntries, ...hotelEntries];
}
