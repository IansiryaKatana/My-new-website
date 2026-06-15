import { Link } from '@tanstack/react-router'
import { useCms } from '@/contexts/CmsContext'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { data } = useCms()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-12 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link to="/" className="font-serif-accent text-2xl">
              {data.siteSettings.brandName}
            </Link>
            <p className="mt-2 text-[10px] text-muted">
              © {year} {data.siteSettings.brandName}. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.14em]">
            {['About', 'Services', 'Properties', 'Team', 'FAQ', 'Contact'].map(
              (l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-olive">
                  {l}
                </a>
              ),
            )}
          </nav>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <a href={`tel:${data.siteSettings.contactPhone.replace(/\D/g, '')}`}>
              {data.siteSettings.contactPhone}
            </a>
            <Button size="sm" asChild>
              <a href="#contact">Get in touch</a>
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-8 md:flex-row md:justify-between">
          <div className="flex gap-4 text-[10px] uppercase tracking-[0.14em] text-muted">
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-olive"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
