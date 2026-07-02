// Layout for /host — the hosting mode. Header + login gate.

import type { Metadata } from "next";
import Link from "next/link";
import HostGate from "@/features/host/HostGate";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Host",
  robots: { index: false, follow: false },
};

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href={ROUTES.host} className="text-lg font-bold text-slate-900">
          Naviora Host
        </Link>
        <Link
          href={ROUTES.hotels}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          Switch to traveling →
        </Link>
      </div>
      <HostGate>{children}</HostGate>
    </div>
  );
}
