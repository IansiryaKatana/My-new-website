import { ArrowUpRight } from "lucide-react";

import { Card } from "../components/ui/card";
import {
  Container,
  Section,
  SectionHeading,
  SectionLabel,
} from "../components/ui/section";
import { articles } from "../lib/content";

export function ArticlesSection() {
  return (
    <Section id="journal" className="bg-paper">
      <Container>
        <div className="mb-12 flex flex-col gap-5 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel>Journal</SectionLabel>
            <SectionHeading className="max-w-xl">
              My curated thoughts, insights, and inspiration
            </SectionHeading>
          </div>
          <a
            href="mailto:hello@wierdtry.studio"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition hover:text-ink"
          >
            Request an article topic
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Card
              key={article.title}
              className="group overflow-hidden border-0 bg-paper-soft p-3 shadow-none"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  {article.category} / {article.readTime}
                </p>
                <h3 className="mt-4 text-lg font-medium leading-tight tracking-[-0.035em] text-ink">
                  {article.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
