export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  wishlist: string[]; // hotel ids
}
