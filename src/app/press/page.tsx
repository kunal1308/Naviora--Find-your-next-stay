import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = { title: "Press" };

export default function PressPage() {
  return (
    <ContentPage
      icon={Newspaper}
      title="Press &amp; media"
      intro="Resources for journalists and media partners."
    >
      <Section heading="Media enquiries">
        <p>
          For interviews, quotes, or partnership stories, reach our team at{" "}
          <a
            href="mailto:press@naviora.example"
            className="font-medium text-brand-700 hover:underline"
          >
            press@naviora.example
          </a>
          .
        </p>
      </Section>
      <Section heading="Brand assets">
        <p>
          Logos, product screenshots, and brand guidelines are available on
          request. Please don&apos;t alter the Naviora logo or colors.
        </p>
      </Section>
    </ContentPage>
  );
}
