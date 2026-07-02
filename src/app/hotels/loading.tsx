// loading.tsx is a Next.js special file: it renders INSTANTLY while the async
// page fetches data, via an automatic Suspense boundary. No wiring needed —
// just export a component. Shown whenever /hotels is loading its Firestore data.

export default function HotelsLoading() {
  return (
    <div className="mx-auto max-w-[96rem] px-4 py-10 sm:px-6">
      <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-5 w-64 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
