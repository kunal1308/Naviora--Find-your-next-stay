export default function HotelDetailLoading() {
  return (
    <div className="mx-auto max-w-[96rem] px-4 py-8 sm:px-6">
      <div className="h-5 w-28 animate-pulse rounded bg-slate-100" />
      <div className="mt-4 h-9 w-72 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-5 w-56 animate-pulse rounded bg-slate-100" />

      <div className="mt-5 grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 sm:col-span-2 sm:row-span-2" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="hidden h-[124px] animate-pulse rounded-2xl bg-slate-100 sm:block"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
