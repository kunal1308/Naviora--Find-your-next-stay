// Single source of truth for booking price math. Used by the order and refund
// API routes so a top-up and a refund are computed the exact same way as the
// original charge — the client only ever sends dates, never amounts.

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const TAX_RATE = 0.12;

export function nightsBetween(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return diff > 0 ? Math.round(diff / MS_PER_DAY) : 0;
}

// Total in the hotel's native currency (subtotal + 12% taxes).
export function totalNative(
  pricePerNight: number,
  checkIn: string,
  checkOut: string,
): number {
  const subtotal = nightsBetween(checkIn, checkOut) * pricePerNight;
  const taxes = Math.round(subtotal * TAX_RATE);
  return subtotal + taxes;
}
