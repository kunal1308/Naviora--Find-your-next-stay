// Server Component (static, ships no JS). Dark footer in the HomeSphere style:
// brand + blurb + rounded social icons, link columns, a contact block, and a
// bottom bar. Real routes use <Link>; a couple are placeholder mailto/labels.

import Link from "next/link";
import { ROUTES } from "@/constants";

type FooterLink = { label: string; href: string };

const SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Support",
    links: [
      { label: "Help Center", href: ROUTES.help },
      { label: "Contact us", href: ROUTES.contact },
      { label: "Cancellation options", href: ROUTES.cancellation },
      { label: "Safety information", href: ROUTES.safety },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Hotels", href: ROUTES.hotels },
      { label: "Destinations", href: ROUTES.destinations },
      { label: "Reviews", href: ROUTES.reviews },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: ROUTES.about },
      { label: "Careers", href: ROUTES.careers },
      { label: "Press", href: ROUTES.press },
      { label: "Blog", href: ROUTES.blog },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: ROUTES.terms },
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Cookies", href: ROUTES.cookies },
    ],
  },
];

const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: "X",
    href: "#",
    path: "M18.9 2H22l-7 8 8.3 12H17l-5-7.3L6.2 22H3l7.5-8.6L2 2h6.2l4.5 6.7L18.9 2Z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 7.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8ZM17.8 3H6.2A3.2 3.2 0 0 0 3 6.2v11.6A3.2 3.2 0 0 0 6.2 21h11.6a3.2 3.2 0 0 0 3.2-3.2V6.2A3.2 3.2 0 0 0 17.8 3Zm-.4 4.1a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.3-.1-2.4-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.9V13h2.5v8h3.1Z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-[96rem] px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          {/* Brand + socials */}
          <div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm">
                N
              </span>
              Naviora
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              Handpicked stays across the world&apos;s best destinations.
              Search, compare, and book in minutes.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/80 transition hover:-translate-y-0.5 hover:bg-brand-600 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/70">
          <span>✉️ support@naviora.example</span>
          <span>📍 New Delhi, India</span>
          <span>📞 +91 98765 43210</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[96rem] flex-col items-center gap-3 px-4 py-5 text-sm text-white/60 sm:px-6 md:flex-row md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 Naviora</span>
            <span aria-hidden>·</span>
            <span>🌐 English (IN)</span>
            <span aria-hidden>·</span>
            <span>₹ INR</span>
          </div>
          <span>Handpicked stays, worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
