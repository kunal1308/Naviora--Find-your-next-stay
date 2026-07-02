import type { Metadata } from "next";
import ContentPage, { Section } from "@/components/ui/ContentPage";
import { LifeBuoy } from "lucide-react";

export const metadata: Metadata = { title: "Help Center" };

const FAQS = [
  {
    q: "How do I book a stay?",
    a: "Open a hotel, choose your check-in and check-out dates, then tap Reserve. You'll need to be signed in.",
  },
  {
    q: "Where do I see my bookings?",
    a: "Your bookings live on your Profile page, accessible from the account menu once you're signed in.",
  },
  {
    q: "How does the wishlist work?",
    a: "Tap the heart on any hotel to save it. Saved stays appear on your Wishlist page and sync to your account.",
  },
  {
    q: "Can I cancel a booking?",
    a: "See our Cancellation options page for details on how cancellations work.",
  },
];

export default function HelpPage() {
  return (
    <ContentPage
      icon={LifeBuoy}
      title="Help Center"
      intro="Answers to the most common questions about Naviora."
    >
      <Section heading="Frequently asked questions">
        <dl className="space-y-4">
          {FAQS.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <dt className="font-medium text-slate-900">{item.q}</dt>
              <dd className="mt-1 text-sm text-slate-600">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section heading="Still need help?">
        <p>
          Reach us any time at{" "}
          <a
            href="mailto:support@naviora.example"
            className="font-medium text-brand-700 hover:underline"
          >
            support@naviora.example
          </a>
          .
        </p>
      </Section>
    </ContentPage>
  );
}
