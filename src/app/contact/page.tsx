import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Mail } from "lucide-react";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <ContentPage
      icon={Mail}
      title="Contact us"
      intro="We'd love to hear from you — questions, feedback, or partnership ideas."
    >
      <Section heading="Support">
        <p>
          For help with a booking or your account, email{" "}
          <a
            href="mailto:support@naviora.example"
            className="font-medium text-brand-700 hover:underline"
          >
            support@naviora.example
          </a>{" "}
          — we usually reply within a day.
        </p>
      </Section>
      <Section heading="Business &amp; press">
        <p>
          For partnerships and media, write to{" "}
          <a
            href="mailto:hello@naviora.example"
            className="font-medium text-brand-700 hover:underline"
          >
            hello@naviora.example
          </a>
          .
        </p>
      </Section>
    </ContentPage>
  );
}
