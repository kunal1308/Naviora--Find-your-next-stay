// Pure formatting helpers — no I/O, no side effects. That's the rule for utils/.

import { INR_RATES } from "@/constants/currency";

// Convert any supported currency amount to INR, for price comparison only.
export function toINR(amount: number, currency: string): number {
  const rate = INR_RATES[currency] ?? 1;
  return amount * rate;
}

export function formatCurrency(
  amount: number,
  currency = "INR",
  locale = "en-IN",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// "★ 4.5", or "New" for a hotel nobody has reviewed yet (rating is 0 then).
export function formatRating(hotel: {
  rating: number;
  reviewCount: number;
}): string {
  return hotel.reviewCount > 0 ? `★ ${hotel.rating}` : "New";
}

// "1 review", "12 reviews", "No reviews yet"
export function formatReviewCount(count: number): string {
  if (count === 0) return "No reviews yet";
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}

export function formatDate(iso: string, locale = "en-IN"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}
