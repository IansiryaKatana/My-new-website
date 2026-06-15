import { ArrowRight } from "lucide-react";

import { BrowserMockup } from "../components/visuals/browser-mockup";
import { Button } from "../components/ui/button";
import { Container, SectionLabel } from "../components/ui/section";

export function HeroSection() {
  return (
    <section className="overflow-hidden px-0 pb-20 pt-32 sm:pb-28 sm:pt-40">
      <Container className="text-center">
        <div className="reveal reveal-delay-1">
          <SectionLabel>Available for selected builds</SectionLabel>
        </div>
        <h1 className="reveal reveal-delay-2 mx-auto max-w-3xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.065em] text-ink sm:text-6xl lg:text-7xl">
          Web designer crafting purposeful online presence
        </h1>
        <p className="reveal reveal-delay-3 mx-auto mt-5 max-w-xl text-sm leading-6 text-ink-soft sm:text-base">
          Premium portfolio, product, and studio websites designed with quiet
          confidence, careful systems, and development-ready detail.
        </p>
        <div className="reveal reveal-delay-3 mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="mailto:hello@wierdtry.studio">
              Work with me
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href="#work">View selected work</a>
          </Button>
        </div>

        <div className="relative mx-auto mt-16 h-[330px] max-w-4xl sm:h-[390px]">
          <BrowserMockup className="absolute left-0 top-16 hidden h-48 w-64 -rotate-3 opacity-80 sm:block lg:left-10" />
          <BrowserMockup className="absolute right-0 top-20 hidden h-48 w-64 rotate-3 opacity-80 sm:block lg:right-10" />

          <div className="absolute left-1/2 top-0 z-10 w-[245px] -translate-x-1/2 overflow-hidden rounded-[1.6rem] bg-ink shadow-[var(--shadow-soft)] sm:w-[295px]">
            <img
              src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=700&q=85"
              alt="Creative director portrait"
              className="h-[320px] w-full object-cover grayscale sm:h-[380px]"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-paper/90 p-4 text-left backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Creative Developer
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                Editorial design with production-grade React execution.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 h-24 w-[82%] -translate-x-1/2 rounded-[999px] bg-accent/25 blur-3xl" />
        </div>
      </Container>
    </section>
  );
}
