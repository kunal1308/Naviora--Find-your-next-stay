export interface Review {
  id: string; // guest reviews use the booking id, so one review per stay
  hotelId: string;
  author: string;
  rating: number; // 0–5 (guest reviews: whole stars 1–5)
  comment: string;
  createdAt: string; // ISO date string
  bookingId?: string; // set on guest reviews; absent on seeded ones
  userId?: string; // reviewer's uid; absent on seeded ones
}
