import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Lock } from "lucide-react";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <ContentPage
      icon={Lock}
      title="Privacy Policy"
      intro="Last updated: July 2026"
    >
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Naviora is a portfolio/demo project. This policy is illustrative and not
        legal advice.
      </p>
      <Section heading="What we collect">
        <p>
          When you create an account we store your name and email. When you save
          stays or make bookings, we store those to power your wishlist and
          profile. We use Google Analytics to understand aggregate usage.
        </p>
      </Section>
      <Section heading="How we use it">
        <p>
          Your data is used to provide the service — signing you in, showing your
          saved stays and bookings, and improving the product. We don&apos;t sell
          your personal data.
        </p>
      </Section>
      <Section heading="Your choices">
        <p>
          You can sign out at any time, and you can request deletion of your
          account data by contacting us.
        </p>
      </Section>
    </ContentPage>
  );
}
