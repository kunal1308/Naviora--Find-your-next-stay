// Server Component: fetch the hotel by id, then hand it to the client form.
// (params is a Promise in Next 16.)

import { notFound } from "next/navigation";
import { getHotelById } from "@/services/hotels";
import HotelForm from "@/features/admin/components/HotelForm";

export default async function EditHotelPage({
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
      <HotelForm initial={hotel} />
    </div>
  );
}
