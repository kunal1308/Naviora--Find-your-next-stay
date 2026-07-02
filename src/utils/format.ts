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

export function formatDate(iso: string, locale = "en-IN"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}
