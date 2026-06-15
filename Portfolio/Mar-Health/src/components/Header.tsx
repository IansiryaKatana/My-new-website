import { Menu, Plus } from "lucide-react";
import { navItems } from "@/data/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 mx-auto flex h-13 items-center justify-between border-b border-black/5 bg-white/85 px-4 backdrop-blur-xl sm:h-14 sm:px-6 lg:px-8">
      <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="flex size-6 items-center justify-center rounded-full bg-mar-black text-[0.62rem] text-white">
          M
        </span>
        <span>Mar-Health</span>
      </a>

      <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="relative text-xs font-semibold text-black/78 transition hover:text-black"
          >
            {item}
            {item === "Resource" ? (
              <span className="absolute -right-3 -top-1 size-1.5 rounded-full bg-mar-black" />
            ) : null}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-black/55 sm:inline">
          Online care / 2026
        </span>
        <button
          type="button"
          aria-label="Open quick actions"
          className="hidden size-8 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/25 sm:flex"
        >
          <Plus className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-full bg-mar-blue text-white transition hover:scale-105"
        >
          <Menu className="size-4 md:hidden" />
          <Plus className="hidden size-4 md:block" />
        </button>
      </div>
    </header>
  );
}
