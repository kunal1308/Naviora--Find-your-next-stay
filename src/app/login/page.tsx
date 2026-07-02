// Thin Server Component: keeps the metadata export and renders the client
// <AuthForm /> island. The page itself ships no JS.

import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/features/auth/components/AuthForm";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Welcome to Naviora
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign in or create an account to save stays and manage bookings.
      </p>

      <div className="mt-8">
        <AuthForm />
      </div>

      <Link
        href={ROUTES.home}
        className="mt-6 text-center text-sm font-medium text-brand-700 hover:text-brand-800"
      >
        ← Back home
      </Link>
    </div>
  );
}
