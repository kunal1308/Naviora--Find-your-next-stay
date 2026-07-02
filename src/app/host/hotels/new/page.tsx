import HotelForm from "@/features/admin/components/HotelForm";

export default function NewHostListingPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
        List a new property
      </h1>
      {/* asHost stamps the current user as the owner and returns to /host. */}
      <HotelForm asHost />
    </div>
  );
}
