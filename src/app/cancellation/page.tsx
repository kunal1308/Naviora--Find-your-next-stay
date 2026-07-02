import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { CalendarX2 } from "lucide-react";

export const metadata: Metadata = { title: "Cancellation options" };

export default function CancellationPage() {
  return (
    <ContentPage
      icon={CalendarX2}
      title="Cancellation options"
      intro="How cancellations and refunds work on Naviora."
    >
      <Section heading="Free cancellation window">
        <p>
          Most stays include free cancellation up to 48 hours before check-in.
          The exact window is shown on each hotel before you book.
        </p>
      </Section>
      <Section heading="After the free window">
        <p>
          Cancellations made after the free window may be subject to a fee set by
          the property, typically the first night&apos;s rate.
        </p>
      </Section>
      <Section heading="How to cancel">
        <p>
          Go to your Profile, find the booking, and follow the cancellation
          steps. Refunds are returned to your original payment method.
        </p>
      </Section>
    </ContentPage>
  );
}
