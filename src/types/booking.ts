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
  paymentId?: string; // first Razorpay payment id (set after a verified payment)
  payments?: string[]; // all payment ids (original + top-ups from edits)
  refunds?: string[]; // refund ids issued against this booking
}
