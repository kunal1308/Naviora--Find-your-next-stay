// Shared layout for static content pages (about, legal, help, etc.).
// Server Component. A gradient header with an optional icon, then a readable
// content column. Keeps all footer pages visually consistent and polished.

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export default function ContentPage({
  title,
  intro,
  icon: Icon,
  children,
}: {
  title: string;
  intro?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
          {Icon && (
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-sm">
              <Icon className="h-7 w-7" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          {intro && (
            <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
              {intro}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="space-y-8 leading-relaxed text-slate-700">
          {children}
        </div>
      </div>
    </>
  );
}

// A titled section inside a ContentPage.
export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
      <div className="mt-3 space-y-3 text-slate-600">{children}</div>
    </section>
  );
}
