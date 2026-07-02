// Rendered automatically when notFound() is called in this route segment,
// or when a URL doesn't match. A special file convention in the App Router.

import Link from "next/link";
import { ROUTES } from "@/constants";

export default function HotelNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="text-5xl">🧭</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        Hotel not found
      </h1>
      <p className="mt-2 text-slate-600">
        We couldn&apos;t find the stay you were looking for. It may have been
        removed.
      </p>
      <Link
        href={ROUTES.hotels}
        className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Browse all hotels
      </Link>
    </div>
  );
}
