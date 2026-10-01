"use client";

// Wraps the host edit page: only the listing's owner (or the admin) may see the
// form. The page itself loads on the server, where the Firebase session isn't
// available, so the owner check has to happen here. UX only — firestore.rules
// already reject saves to someone else's listing.

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { ROUTES, isAdmin } from "@/constants";

export default function HostListingGuard({
  ownerId,
  children,
}: {
  ownerId?: string;
  children: ReactNode;
}) {
  // HostGate (in /host's layout) only renders this once a user is signed in.
  const { user } = useAuth();

  const canEdit =
    !!user && (ownerId === user.uid || isAdmin(user.email));

  if (!canEdit) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
        <div className="text-4xl">🔍</div>
        <p className="mt-3 text-lg font-medium text-slate-700">
          Listing not found
        </p>
        <p className="mt-1 text-sm text-slate-500">
          This listing doesn&apos;t exist or isn&apos;t yours to edit.
        </p>
        <Link
          href={ROUTES.host}
          className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Back to your listings
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
