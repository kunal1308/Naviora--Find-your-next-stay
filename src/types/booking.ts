export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  hotelId: string;
  userId: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  guests: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  createdAt: string; // ISO date
  paymentId?: string; // Razorpay payment id (set after a verified payment)
}
