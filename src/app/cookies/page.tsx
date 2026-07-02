import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Cookie } from "lucide-react";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <ContentPage
      icon={Cookie}
      title="Cookie Policy"
      intro="Last updated: July 2026"
    >
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Naviora is a portfolio/demo project. This policy is illustrative and not
        legal advice.
      </p>
      <Section heading="What cookies we use">
        <p>
          Naviora uses essential cookies to keep you signed in, and analytics
          cookies (via Google Analytics) to understand how the site is used.
        </p>
      </Section>
      <Section heading="Managing cookies">
        <p>
          You can control or delete cookies through your browser settings.
          Disabling essential cookies may affect sign-in and other core features.
        </p>
      </Section>
    </ContentPage>
  );
}
