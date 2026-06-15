import { motion, useReducedMotion } from 'framer-motion'
import { useCms } from '#/contexts/CmsContext'
import { Reveal } from './Reveal'

export function LogoStrip() {
  const { snapshot } = useCms()
  const { logoStrip } = snapshot
  const reduced = useReducedMotion()

  return (
    <section className="py-20 md:py-[90px] text-center bg-white">
      <Reveal>
        <p className="text-[11px] text-valence-muted mb-12 tracking-wide">
          {logoStrip.label}
        </p>
      </Reveal>
      <div className="container-valence flex flex-wrap justify-center items-center gap-8 md:gap-[clamp(32px,5vw,72px)]">
        {logoStrip.logos.map((logo, i) => (
          <motion.div
            key={logo.id}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {logo.image ? (
              <img
                src={logo.image}
                alt={logo.alt}
                className="h-5 md:h-6 w-auto opacity-78 grayscale"
              />
            ) : (
              <span className="text-sm md:text-base font-medium text-valence-text/78 tracking-tight">
                {logo.name}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
