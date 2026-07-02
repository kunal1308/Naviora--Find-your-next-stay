// Server Component: load the listing, hand it to the client form in host mode.
// Editing someone else's listing is blocked by firestore.rules on save.

import { notFound } from "next/navigation";
import { getHotelById } from "@/services/hotels";
import HotelForm from "@/features/admin/components/HotelForm";

export default async function EditHostListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hotel = await getHotelById(id);
  if (!hotel) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        Edit {hotel.name}
      </h1>
      <HotelForm initial={hotel} asHost />
    </div>
  );
}
