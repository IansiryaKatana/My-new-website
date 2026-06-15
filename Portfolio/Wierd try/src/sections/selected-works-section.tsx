import { ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Container, Section, SectionHeading } from "../components/ui/section";
import { cn } from "../lib/utils";
import { selectedWorks } from "../lib/content";

export function SelectedWorksSection() {
  return (
    <Section className="pt-6">
      <Container>
        <div className="mb-12 flex flex-col gap-5 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading className="max-w-2xl">
            A curated selection of websites designed with care
          </SectionHeading>
          <p className="max-w-sm text-sm leading-6 text-ink-soft">
            Each case study balances personality, business clarity, and the
            soft visual depth seen in the reference.
          </p>
        </div>

        <div className="space-y-8">
          {selectedWorks.map((work) => (
            <article
              key={work.title}
              className="grid gap-5 rounded-[2rem] bg-paper-soft p-4 sm:p-5 lg:grid-cols-[0.42fr_0.58fr]"
            >
              <div className="flex flex-col justify-between rounded-[1.5rem] bg-paper p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div>
                  <span className={cn("block h-3 w-3 rounded-sm", work.accent)} />
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    {work.category} / {work.year}
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-ink sm:text-3xl">
                    {work.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-ink-soft">
                    {work.description}
                  </p>
                </div>
                <Button asChild variant="secondary" className="mt-8 self-start" size="sm">
                  <a href="mailto:hello@wierdtry.studio">
                    View case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>

              <div className="group overflow-hidden rounded-[1.5rem] bg-ink">
                <img
                  src={work.image}
                  alt={`${work.title} project visual`}
                  loading="lazy"
                  className="h-[320px] w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] sm:h-[430px]"
                />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
