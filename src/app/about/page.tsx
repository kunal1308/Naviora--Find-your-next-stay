import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Compass } from "lucide-react";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <ContentPage
      icon={Compass}
      title="About Naviora"
      intro="We help travelers discover and book handpicked stays across the world's best destinations."
    >
      <Section heading="Our story">
        <p>
          Naviora started with a simple idea: booking a great stay shouldn&apos;t
          be overwhelming. Instead of endless listings, we curate a focused
          selection of hotels — each chosen for location, quality, and character.
        </p>
      </Section>
      <Section heading="What we believe">
        <p>
          Travel should feel effortless. From search to checkout, every step is
          designed to be fast, transparent, and genuinely useful — no hidden
          fees, no clutter.
        </p>
      </Section>
      <Section heading="The team">
        <p>
          Naviora is a small, product-focused team spread across a few time
          zones, united by a love of travel and well-crafted software.
        </p>
      </Section>
    </ContentPage>
  );
}
