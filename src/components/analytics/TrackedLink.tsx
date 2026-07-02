"use client";

// A Link that logs an analytics event on click. Lets Server Components track
// clicks (e.g. destination cards) without becoming client components.

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export default function TrackedLink({
  href,
  event,
  params,
  className,
  children,
}: {
  href: string;
  event: string;
  params?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => void trackEvent(event, params)}
    >
      {children}
    </Link>
  );
}
