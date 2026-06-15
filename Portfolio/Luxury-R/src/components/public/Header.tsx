import { Link } from '@tanstack/react-router'
import { useCms } from '@/contexts/CmsContext'
import { Button } from '@/components/ui/button'

const nav = [
  { label: "What's on", href: '#properties' },
  { label: 'Sales', href: '#properties' },
  { label: 'Agencies', href: '#team' },
  { label: 'For Partners', href: '#contact' },
  { label: 'About Us', href: '#team' },
  { label: 'FAQ', href: '#faq' },
]

export function Header() {
  const { data } = useCms()
  const { siteSettings } = data

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:px-10 lg:h-[70px]">
        <Link
          to="/"
          className="font-serif-accent text-2xl text-white md:text-3xl"
        >
          {siteSettings.brandName}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[10px] uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${siteSettings.contactPhone.replace(/\D/g, '')}`}
            className="hidden text-[10px] uppercase tracking-[0.12em] text-white/80 md:block"
          >
            {siteSettings.contactPhone}
          </a>
          <Button variant="white" size="sm" asChild>
            <a href="#contact">Get in touch</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
