import { useCms } from '#/contexts/CmsContext'

export function Footer() {
  const { snapshot } = useCms()
  if (!snapshot) return null
  const brand = (snapshot.siteSettings.brand_name as string) ?? 'Marden'

  return (
    <footer id="contact" className="bg-verden-footer text-white">
      <div className="max-editorial section-pad pb-8 pt-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-4">
          {snapshot.footerColumns.map((col) => (
            <div key={col.id}>
              <p className="mb-4 text-[11px] text-white/50">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-white/80 transition hover:text-verden-pale"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-verden-pale/40">
              <span className="h-6 w-6 rotate-45 border border-verden-pale" />
            </div>
            <p className="text-[clamp(3rem,12vw,7rem)] font-normal leading-none tracking-[-0.04em] text-white">
              {brand}
            </p>
          </div>
          <div className="flex gap-6 md:justify-end">
            {snapshot.socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.href}
                className="text-[11px] text-white/60 transition hover:text-verden-pale"
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
