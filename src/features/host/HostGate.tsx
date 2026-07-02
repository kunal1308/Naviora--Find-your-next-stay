"use client";

// Gate for /host. Unlike the admin gate, ANY signed-in user can host — they
// just need to be logged in. Real security is in firestore.rules (a user can
// only write listings they own).

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { ROUTES } from "@/constants";

export default function HostGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <div className="text-4xl">🏡</div>
        <p className="mt-3 text-lg font-medium text-slate-700">
          Sign in to start hosting
        </p>
        <p className="mt-1 text-sm text-slate-500">
          List your property and reach travelers on Naviora.
        </p>
        <Link
          href={ROUTES.login}
          className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
