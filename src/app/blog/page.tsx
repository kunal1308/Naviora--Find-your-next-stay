import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { PenLine } from "lucide-react";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <ContentPage
      icon={PenLine}
      title="The Naviora blog"
      intro="Travel guides, destination tips, and product updates."
    >
      <Section heading="Coming soon">
        <p>
          We&apos;re putting together destination guides and travel tips to help
          you plan smarter trips. Check back soon — or follow us on social to
          know when the first posts go live.
        </p>
      </Section>
    </ContentPage>
  );
}
