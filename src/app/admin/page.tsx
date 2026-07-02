import AdminHotelList from "@/features/admin/components/AdminHotelList";
import SeedButton from "@/features/admin/components/SeedButton";
import PriceCapButton from "@/features/admin/components/PriceCapButton";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminHotelList />

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <h2 className="font-semibold text-slate-900">Sample data</h2>
        <p className="mt-1 text-sm text-slate-500">
          Adds 10 new random hotels each click across 10 destinations.
          Add-only — it never deletes or replaces existing hotels. Runs as you
          (admin), so no rule changes needed.
        </p>
        <div className="mt-3">
          <SeedButton />
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <h2 className="font-semibold text-slate-900">Test-mode payments</h2>
        <p className="mt-1 text-sm text-slate-500">
          Lowers any hotel whose nightly rate is too high to pay in Razorpay
          test mode (large amounts are rejected). Only changes prices; existing
          bookings keep their totals.
        </p>
        <div className="mt-3">
          <PriceCapButton />
        </div>
      </div>
    </div>
  );
}
