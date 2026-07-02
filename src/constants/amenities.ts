// Catalog of amenities a hotel can offer.
// `as const` freezes the array so we can derive a precise union type (AmenityId)
// from it — one source of truth for both the data and the type system.

export const AMENITIES = [
  { id: "wifi", label: "Free WiFi", icon: "📶" },
  { id: "pool", label: "Swimming Pool", icon: "🏊" },
  { id: "gym", label: "Fitness Center", icon: "🏋️" },
  { id: "spa", label: "Spa", icon: "💆" },
  { id: "parking", label: "Free Parking", icon: "🅿️" },
  { id: "breakfast", label: "Breakfast Included", icon: "🍳" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "beach", label: "Beach Access", icon: "🏖️" },
  { id: "petFriendly", label: "Pet Friendly", icon: "🐾" },
] as const;

export type AmenityId = (typeof AMENITIES)[number]["id"];

// Quick lookup by id, e.g. AMENITY_MAP.wifi.label
export const AMENITY_MAP = Object.fromEntries(
  AMENITIES.map((a) => [a.id, a]),
) as Record<AmenityId, (typeof AMENITIES)[number]>;
