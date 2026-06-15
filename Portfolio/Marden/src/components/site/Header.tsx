import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useCms } from '#/contexts/CmsContext'
import { cn } from '#/lib/utils'

export function Header() {
  const { snapshot } = useCms()
  const [open, setOpen] = useState(false)
  if (!snapshot) return null

  const nav = snapshot.navigation
  const brand = (snapshot.siteSettings.brand_name as string) ?? 'Marden'

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 md:px-12">
        <a href="#" className="text-sm tracking-tight text-white">
          {brand}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) =>
            item.is_cta ? (
              <a
                key={item.id}
                href={item.href}
                className="ml-2 rounded-[2px] bg-verden-pale px-3 py-1.5 text-[11px] text-verden-ink transition hover:bg-[#e8f88a]"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.id}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-[11px] text-white/90 transition hover:bg-white/10"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <button
          type="button"
          className="text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-verden-forest/95 px-6 py-4 md:hidden">
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                'py-2 text-sm text-white',
                item.is_cta && 'mt-2 inline-flex w-fit rounded-[2px] bg-verden-pale px-3 text-verden-ink',
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
