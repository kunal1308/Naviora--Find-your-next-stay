export interface Review {
  id: string;
  hotelId: string;
  author: string;
  rating: number; // 0–5
  comment: string;
  createdAt: string; // ISO date string
}
