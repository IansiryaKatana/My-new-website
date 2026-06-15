import { motion, useReducedMotion } from 'framer-motion'
import { Linkedin } from 'lucide-react'
import { useCms } from '#/contexts/CmsContext'
import { Reveal } from './Reveal'

export function Footer() {
  const { snapshot } = useCms()
  const footer = snapshot.footer
  const reduced = useReducedMotion()

  return (
    <footer className="bg-valence-navy text-white pt-14 pb-6">
      <div className="container-valence">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-lg leading-[1.35] max-w-[360px] text-white/90">
                {footer.statement}
              </p>
            </Reveal>
            <div className="flex gap-4 mt-8">
              {footer.socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  className="text-white/75 hover:text-white text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.platform === 'LinkedIn' ? (
                    <Linkedin className="h-4 w-4" />
                  ) : (
                    s.platform
                  )}
                </a>
              ))}
            </div>
          </div>

          {footer.linkGroups.map((group) => (
            <div key={group.id} className="md:col-span-2">
              {group.title && (
                <p className="text-xs text-white/50 mb-3 uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="text-[13px] text-white/75 hover:text-white leading-8"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          className="mt-20 md:mt-[90px] overflow-hidden pointer-events-none select-none"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[clamp(6rem,18vw,16.25rem)] leading-[0.75] tracking-[-0.08em] text-white/[0.06] font-light"
            aria-hidden
          >
            {footer.wordmark}
          </p>
        </motion.div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between text-xs text-white/50">
          <span>© {new Date().getFullYear()} Valence Capital</span>
          <div className="flex flex-wrap gap-4">
            {footer.legalLinks.map((l) => (
              <a key={l.id} href={l.href} className="hover:text-white/75">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
