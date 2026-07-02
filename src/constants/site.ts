// Site-wide constants used for SEO (metadata, sitemap, robots, manifest).
// Set NEXT_PUBLIC_SITE_URL to your production URL after deploying so Open Graph
// images and the sitemap use absolute URLs.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "Naviora";
export const SITE_DESCRIPTION =
  "Discover and book handpicked hotels and stays across the world's best destinations.";
