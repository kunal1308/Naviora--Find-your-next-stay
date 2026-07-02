// Layout for every /admin route. Renders the shared admin header and wraps
// children in the AdminGate so non-admins never see the tools.

import type { Metadata } from "next";
import Link from "next/link";
import AdminGate from "@/features/admin/AdminGate";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href={ROUTES.admin} className="text-lg font-bold text-slate-900">
          Naviora Admin
        </Link>
      </div>
      <AdminGate>{children}</AdminGate>
    </div>
  );
}
