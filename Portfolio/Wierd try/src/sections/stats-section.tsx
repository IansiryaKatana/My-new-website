import { ArrowUpRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Container, Section } from "../components/ui/section";
import { stats } from "../lib/content";

export function StatsSection() {
  return (
    <Section className="bg-paper-soft">
      <Container className="grid gap-5 lg:grid-cols-[1fr_1.35fr]">
        <Card className="reveal flex min-h-[340px] flex-col justify-between overflow-hidden border-0 bg-ink p-6 text-paper sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Built around trust
            </p>
            <h2 className="mt-5 max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">
              Calm systems for websites that need to feel premium on the first scroll.
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xs text-sm leading-6 text-white/65">
              Every visual decision supports clarity: from hierarchy and proof
              to responsive layouts and conversion-ready calls to action.
            </p>
            <Button asChild variant="dark" size="sm">
              <a href="#process">
                See process
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="reveal min-h-[160px] p-6 sm:p-8"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className="text-4xl font-medium tracking-[-0.06em] text-ink sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-5 max-w-[13rem] text-sm leading-6 text-ink-soft">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
