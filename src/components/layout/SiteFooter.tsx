import { Link } from '@tanstack/react-router'

import { useSiteConfig } from '../../contexts/CmsContext'
import { fontCopy, textCopySm } from '../../lib/typography'
import { cn } from '../../lib/utils'

export function SiteFooter() {
  const siteConfig = useSiteConfig()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#D8D7C3]/15 bg-[#10140D] px-6 py-16 text-[#D8D7C3] sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-3xl font-black uppercase tracking-[-0.03em]">
            {siteConfig.name}
          </p>
          <p className={cn('mt-4 max-w-md', textCopySm, 'text-[#D8D7C3]/75')}>
            {siteConfig.tagline}
          </p>
          <a
            href={`mailto:${siteConfig.email}?subject=Project%20Inquiry`}
            className="mt-6 inline-block font-display text-3xl font-black uppercase tracking-[-0.03em] transition-colors hover:text-white"
          >
            Send Ian an Email
          </a>
        </div>

        <div>
          <p className="font-display text-xs font-black uppercase tracking-[0.2em] text-[#D8D7C3]/60">
            Pages
          </p>
          <nav className="mt-4 grid gap-2" aria-label="Footer pages">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="font-display text-lg font-black uppercase transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="font-display text-xs font-black uppercase tracking-[0.2em] text-[#D8D7C3]/60">
            Connect
          </p>
          <nav className="mt-4 grid gap-2" aria-label="Social links">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noreferrer"
              className="font-display text-lg font-black uppercase transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-display text-lg font-black uppercase transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-display text-lg font-black uppercase transition-colors hover:text-white"
            >
              X / Twitter
            </a>
          </nav>
        </div>
      </div>

      <div className={cn('mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-[#D8D7C3]/10 pt-6 text-sm text-white sm:flex-row sm:items-center sm:justify-between', fontCopy)}>
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p>{siteConfig.location}</p>
      </div>
    </footer>
  )
}

