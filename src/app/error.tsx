"use client";

// error.tsx is a Next.js special file: an error boundary for this segment and
// below. It MUST be a Client Component and receives `reset()` to retry
// rendering. Catches unexpected runtime errors (e.g. a failed Firestore read).

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="text-5xl">⚠️</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        Something went wrong
      </h1>
      <p className="mt-2 text-slate-600">
        An unexpected error occurred. You can try again or head back home.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href={ROUTES.home}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
