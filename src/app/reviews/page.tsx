import type { Metadata } from "next";
import Link from "next/link";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { Star } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return (
    <ContentPage
      icon={Star}
      title="Reviews"
      intro="Real guest reviews help you book with confidence."
    >
      <Section heading="How reviews work">
        <p>
          Reviews come from guests who have stayed at a property. Each hotel
          shows its rating and recent reviews on its detail page.
        </p>
      </Section>
      <Section heading="See reviews in action">
        <p>
          Browse our{" "}
          <Link
            href={ROUTES.hotels}
            className="font-medium text-brand-700 hover:underline"
          >
            hotels
          </Link>{" "}
          and open any stay to read what guests had to say.
        </p>
      </Section>
    </ContentPage>
  );
}
