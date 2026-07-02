export default function DestinationsLoading() {
  return (
    <div className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6">
      <div className="h-9 w-56 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-5 w-72 animate-pulse rounded bg-slate-100" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}
