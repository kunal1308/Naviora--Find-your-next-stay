// Approximate exchange rates to INR. Used ONLY for cross-currency price
// filtering and sorting — display always uses each hotel's native currency.
// These are rough static values; a production app would fetch live rates.

export const INR_RATES: Record<string, number> = {
  INR: 1,
  AED: 23,
  SGD: 62,
  JPY: 0.55,
  USD: 83,
  EUR: 90,
};
