import HotelForm from "@/features/admin/components/HotelForm";

export default function NewHotelPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        Add a hotel
      </h1>
      <HotelForm />
    </div>
  );
}
