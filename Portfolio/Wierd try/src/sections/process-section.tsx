import { CheckCircle2 } from "lucide-react";

import { Card } from "../components/ui/card";
import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
} from "../components/ui/section";
import { process } from "../lib/content";

export function ProcessSection() {
  return (
    <Section id="process" className="bg-paper">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel>Process</SectionLabel>
          <SectionHeading className="max-w-md">
            Precise enough to launch, flexible enough to feel human
          </SectionHeading>
          <p className="mt-6 max-w-sm text-sm leading-6 text-ink-soft">
            The workflow keeps the premium visual direction connected to
            content, responsive behavior, and real conversion goals.
          </p>
        </div>

        <div className="space-y-4">
          {process.map((item) => (
            <Card key={item.step} className="grid gap-5 p-6 sm:grid-cols-[auto_1fr] sm:p-7">
              <div className="flex items-center gap-3 sm:block">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-soft text-xs font-semibold text-ink">
                  {item.step}
                </span>
                <CheckCircle2 className="h-5 w-5 text-[#27C86B] sm:mt-5" />
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-[-0.035em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
