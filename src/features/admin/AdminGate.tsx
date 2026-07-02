"use client";

// Client-side admin gate. Wraps everything under /admin (via app/admin/layout).
// This is UX-level protection only — the REAL enforcement is in firestore.rules,
// which rejects catalog writes from anyone but the admin email. Never trust the
// client for security.

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { isAdmin } from "@/constants";
import { ROUTES } from "@/constants";

export default function AdminGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (!isAdmin(user?.email)) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <div className="text-4xl">🔒</div>
        <p className="mt-3 text-lg font-medium text-slate-700">
          Admins only
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {user
            ? "Your account doesn't have admin access."
            : "Sign in with an admin account to continue."}
        </p>
        <Link
          href={user ? ROUTES.home : ROUTES.login}
          className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {user ? "Back home" : "Sign in"}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
