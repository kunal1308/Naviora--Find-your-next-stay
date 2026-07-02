export interface Destination {
  id: string;
  slug: string;
  name: string; // e.g. "Goa"
  country: string;
  tagline: string;
  image: string; // url (external host, e.g. Cloudinary)
  hotelCount: number;
}
