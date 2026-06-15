import { Sparkle } from "lucide-react";

import { Container, Section, SectionHeading, SectionLabel } from "../components/ui/section";
import { services } from "../lib/content";

export function ServicesSection() {
  return (
    <Section id="services" className="bg-night text-paper">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <SectionLabel>Services</SectionLabel>
          <SectionHeading className="max-w-lg text-paper">
            Strategy, design, and development without visual noise
          </SectionHeading>
          <p className="mt-6 max-w-md text-sm leading-6 text-night-soft">
            A focused offer for people who need a website to communicate taste,
            expertise, and trust before a sales conversation starts.
          </p>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="reveal grid gap-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:bg-white/[0.06] sm:grid-cols-[auto_1fr] sm:p-7"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${service.accent}`}>
                <Sparkle className="h-4 w-4 text-ink" />
              </span>
              <div>
                <h3 className="text-xl font-medium tracking-[-0.035em] text-paper">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-night-soft">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
