// Single source of truth for every URL in the app.
// Use ROUTES.hotel(id) instead of scattering string templates around — if a
// path changes, you change it once here.

export const ROUTES = {
  home: "/",
  hotels: "/hotels",
  hotel: (id: string) => `/hotels/${id}`,
  destinations: "/destinations",
  wishlist: "/wishlist",
  login: "/login",
  profile: "/profile",
  // Static content pages (linked from the footer)
  help: "/help",
  contact: "/contact",
  cancellation: "/cancellation",
  safety: "/safety",
  reviews: "/reviews",
  about: "/about",
  careers: "/careers",
  press: "/press",
  blog: "/blog",
  terms: "/terms",
  privacy: "/privacy",
  cookies: "/cookies",
  admin: "/admin",
  adminUsers: "/admin/users",
  adminNewHotel: "/admin/hotels/new",
  adminEditHotel: (id: string) => `/admin/hotels/${id}/edit`,
  host: "/host",
  hostNewHotel: "/host/hotels/new",
  hostEditHotel: (id: string) => `/host/hotels/${id}/edit`,
} as const;
