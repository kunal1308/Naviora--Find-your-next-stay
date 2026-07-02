"use client";

// Client Component: mobile menu state, active-link highlight (usePathname),
// and auth-aware nav. Guests see Hotels/Destinations + wishlist + host CTA;
// the admin sees a management nav (Listings / Users) instead.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { signOutUser } from "@/services/auth";
import { ROUTES, isAdmin } from "@/constants";
import { nameFromEmail } from "@/utils";

const GUEST_LINKS = [
  { href: ROUTES.hotels, label: "Hotels" },
  { href: ROUTES.destinations, label: "Destinations" },
];

const ADMIN_LINKS = [
  { href: ROUTES.admin, label: "Listings" },
  { href: ROUTES.adminUsers, label: "Users" },
];

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const admin = !!user && isAdmin(user.email);
  const centerLinks = admin ? ADMIN_LINKS : GUEST_LINKS;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Highlight only the most specific matching link, so /admin/users doesn't
  // also light up "Listings" (/admin).
  const activeHrefIn = (links: { href: string }[]) =>
    links
      .filter((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
      .reduce<string | null>(
        (best, l) => (l.href.length > (best?.length ?? 0) ? l.href : best),
        null,
      );
  const centerActive = activeHrefIn(centerLinks);
  const mobileLinks = [
    ...centerLinks,
    ...(user && !admin
      ? [{ href: ROUTES.wishlist, label: "Wishlist" }]
      : []),
  ];
  const mobileActive = activeHrefIn(mobileLinks);

  async function handleSignOut() {
    await signOutUser();
    setOpen(false);
    router.push(ROUTES.home);
  }

  const displayName =
    user?.displayName || nameFromEmail(user?.email) || "there";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[96rem] items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href={admin ? ROUTES.admin : ROUTES.home}
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            N
          </span>
          <span className="tracking-tight">Naviora</span>
        </Link>

        {/* Primary links (center) */}
        <ul className="hidden items-center gap-1 md:flex">
          {centerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  link.href === centerActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden items-center gap-1 md:flex">
          {user && !admin && (
            <Link
              href={ROUTES.wishlist}
              aria-label="Wishlist"
              className={`rounded-lg p-2 transition-colors ${
                isActive(ROUTES.wishlist)
                  ? "text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <HeartIcon />
            </Link>
          )}

          {loading ? (
            <div className="ml-1 h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <>
              {!admin && (
                <Link
                  href={ROUTES.host}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  List your property
                </Link>
              )}
              <Link
                href={ROUTES.profile}
                className="ml-1 flex items-center gap-2 rounded-full border border-slate-300 px-2 py-1.5 text-sm hover:shadow-sm"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {(displayName[0] || "?").toUpperCase()}
                </span>
                <span className="pr-1 font-medium text-slate-800">
                  {displayName}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href={ROUTES.login}
              className="ml-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <ul className="space-y-1 px-4 py-3">
            {mobileLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    link.href === mobileActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user && !admin && (
              <li>
                <Link
                  href={ROUTES.host}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  List your property
                </Link>
              </li>
            )}
            <li className="pt-1">
              {user ? (
                <div className="space-y-1">
                  <Link
                    href={ROUTES.profile}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Profile ({displayName})
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href={ROUTES.login}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Sign in
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
