import { Quote } from "lucide-react";

import { Card } from "../components/ui/card";
import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
} from "../components/ui/section";
import { testimonials } from "../lib/content";

export function TestimonialsSection() {
  return (
    <Section className="overflow-hidden bg-paper-soft">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Client words</SectionLabel>
          <SectionHeading>Social proof arranged like an editorial collage</SectionHeading>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-5xl gap-5 lg:grid-cols-[1fr_0.9fr_1fr] lg:items-center">
          <div className="space-y-5">
            <TestimonialCard {...testimonials[0]} />
            <TestimonialCard {...testimonials[1]} />
          </div>

          <div className="relative mx-auto w-full max-w-[290px] overflow-hidden rounded-[1.75rem] bg-ink shadow-[var(--shadow-soft)]">
            <div className="bg-accent p-6">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85"
                alt="Client portrait"
                loading="lazy"
                className="h-[250px] w-full rounded-3xl object-cover grayscale"
              />
            </div>
            <div className="p-6 text-paper">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Featured partner
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                “A launch that finally matched the quality of our practice.”
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <TestimonialCard {...testimonials[2]} />
            <TestimonialCard {...testimonials[3]} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <Card className="p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
      <Quote className="h-5 w-5 text-accent" />
      <p className="mt-5 text-sm leading-6 text-ink">{quote}</p>
      <div className="mt-6">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="mt-1 text-xs text-ink-soft">{role}</p>
      </div>
    </Card>
  );
}
