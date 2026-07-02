import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Safety information" };

export default function SafetyPage() {
  return (
    <ContentPage
      icon={ShieldCheck}
      title="Safety information"
      intro="How we help keep travelers and their data safe."
    >
      <Section heading="Verified stays">
        <p>
          Every hotel on Naviora is reviewed by our team before it goes live, so
          you can book with confidence.
        </p>
      </Section>
      <Section heading="Secure account">
        <p>
          Sign-in is handled by Firebase Authentication, and your bookings and
          wishlist are protected so only you can access them.
        </p>
      </Section>
      <Section heading="Report a concern">
        <p>
          If something doesn&apos;t look right, email{" "}
          <a
            href="mailto:safety@naviora.example"
            className="font-medium text-brand-700 hover:underline"
          >
            safety@naviora.example
          </a>{" "}
          and our team will look into it.
        </p>
      </Section>
    </ContentPage>
  );
}
