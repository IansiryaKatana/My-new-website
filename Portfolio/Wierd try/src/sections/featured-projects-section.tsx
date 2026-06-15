import { ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
} from "../components/ui/section";
import { featuredProjects } from "../lib/content";

export function FeaturedProjectsSection() {
  return (
    <Section id="work" className="bg-paper">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Project proof</SectionLabel>
          <SectionHeading>Projects building momentum through restraint</SectionHeading>
          <p className="mt-5 text-sm leading-6 text-ink-soft">
            Blurred contextual mockups frame each story, keeping attention on
            the offer, strategy, and next action.
          </p>
        </div>

        <div className="mt-14 space-y-8">
          {featuredProjects.map((project) => (
            <Card
              key={project.title}
              className="group relative min-h-[360px] overflow-hidden border-0 bg-paper-soft p-5 shadow-none sm:min-h-[430px] sm:p-8"
            >
              <img
                src={project.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-20 blur-[2px] transition duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-paper/55" />
              <div className="relative grid min-h-[320px] place-items-center sm:min-h-[370px]">
                <div className="max-w-md rounded-3xl border border-line bg-paper p-6 text-center shadow-[var(--shadow-soft)] transition duration-300 group-hover:-translate-y-1 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                    {project.meta}
                  </p>
                  <h3 className="mt-4 text-2xl font-medium tracking-[-0.045em] text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-ink-soft">
                    {project.description}
                  </p>
                  <Button asChild className="mt-6" size="sm">
                    <a href="mailto:hello@wierdtry.studio">
                      Discuss similar work
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
