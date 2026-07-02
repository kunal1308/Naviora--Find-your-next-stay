import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { ScrollText } from "lucide-react";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <ContentPage
      icon={ScrollText}
      title="Terms of Service"
      intro="Last updated: July 2026"
    >
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Naviora is a portfolio/demo project. These terms are illustrative and
        not legal advice.
      </p>
      <Section heading="Using Naviora">
        <p>
          By accessing Naviora you agree to use the service lawfully and not to
          misuse, disrupt, or attempt to gain unauthorized access to any part of
          it.
        </p>
      </Section>
      <Section heading="Bookings">
        <p>
          Bookings made through Naviora are subject to the terms of the
          individual property. Prices and availability may change until a
          booking is confirmed.
        </p>
      </Section>
      <Section heading="Accounts">
        <p>
          You are responsible for keeping your account credentials secure and
          for all activity that occurs under your account.
        </p>
      </Section>
      <Section heading="Changes">
        <p>
          We may update these terms from time to time. Continued use of Naviora
          after changes means you accept the revised terms.
        </p>
      </Section>
    </ContentPage>
  );
}
