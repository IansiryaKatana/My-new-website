import { ArrowRight } from "lucide-react";

import { Button } from "../components/ui/button";
import { Container } from "../components/ui/section";
import { navigation } from "../lib/content";

export function Footer() {
  return (
    <footer className="bg-night py-14 text-paper sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <a href="#" className="flex items-center gap-2 text-sm font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-paper text-[10px] text-ink">
                WT
              </span>
              Wierd Try
            </a>
            <h2 className="mt-8 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.05em] sm:text-5xl">
              Ready for a web presence that feels considered from the first pixel?
            </h2>
            <Button asChild variant="dark" size="lg" className="mt-8">
              <a href="mailto:hello@wierdtry.studio">
                Start a project
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold text-paper">Navigate</p>
              <div className="mt-4 space-y-3 text-night-soft">
                {navigation.map((item) => (
                  <a key={item.href} href={item.href} className="block transition hover:text-paper">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-paper">Contact</p>
              <div className="mt-4 space-y-3 text-night-soft">
                <a className="block transition hover:text-paper" href="mailto:hello@wierdtry.studio">
                  hello@wierdtry.studio
                </a>
                <a className="block transition hover:text-paper" href="https://www.linkedin.com">
                  LinkedIn
                </a>
                <a className="block transition hover:text-paper" href="https://www.behance.net">
                  Behance
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-night-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Wierd Try. All rights reserved.</p>
          <p>React 19, TanStack Start, Vite, Tailwind CSS v4.</p>
        </div>
      </Container>
    </footer>
  );
}
