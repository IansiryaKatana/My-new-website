import { Menu } from "lucide-react";

import { Button } from "../components/ui/button";
import { navigation } from "../lib/content";

export function Header() {
  return (
    <header className="reveal fixed inset-x-0 top-0 z-50 border-b border-transparent bg-paper/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold tracking-[-0.03em]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] text-paper">
            WT
          </span>
          Wierd Try
        </a>

        <nav className="hidden items-center gap-7 text-xs font-medium text-ink-soft md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="mailto:hello@wierdtry.studio">Book a call</a>
          </Button>
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
