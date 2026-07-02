import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <ContentPage
      icon={Briefcase}
      title="Careers at Naviora"
      intro="Build the future of travel with a small, high-craft team."
    >
      <Section heading="Why Naviora">
        <p>
          We&apos;re a lean team that ships thoughtfully. You&apos;ll own real
          problems end to end, work with modern tools, and see your work reach
          travelers quickly.
        </p>
      </Section>
      <Section heading="Open roles">
        <p>
          We don&apos;t have any open positions right now, but we&apos;re always
          happy to hear from exceptional people. Send us a note and tell us what
          you&apos;d love to work on.
        </p>
      </Section>
    </ContentPage>
  );
}
