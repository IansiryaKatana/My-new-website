import { motion, useReducedMotion } from 'framer-motion'
import { useCms } from '#/contexts/CmsContext'
import { ButtonArrow } from './ButtonArrow'

export function Hero({ onTalk }: { onTalk: () => void }) {
  const { snapshot } = useCms()
  const { hero } = snapshot
  const reduced = useReducedMotion()
  const lines = hero.statement.split('\n')

  return (
    <section className="relative min-h-[90vh] md:min-h-[780px] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center image-editorial"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        initial={reduced ? false : { scale: 1.06, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'var(--color-valence-hero-overlay)' }}
      />

      <div className="relative container-valence flex flex-col justify-end min-h-[90vh] md:min-h-[780px] pb-16 md:pb-20 pt-24">
        <div className="absolute left-0 right-0 top-[42%] h-px bg-white/20 hidden md:block" />

        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <motion.h1
              className="hero-title text-white/92"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.span
                className="block"
                initial={reduced ? false : { y: 48, clipPath: 'inset(100% 0 0 0)' }}
                animate={{ y: 0, clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {hero.titleLineOne}
              </motion.span>
              <motion.span
                className="block md:pl-[18%]"
                initial={reduced ? false : { y: 48, clipPath: 'inset(100% 0 0 0)' }}
                animate={{ y: 0, clipPath: 'inset(0 0 0 0)' }}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {hero.titleLineTwo}
              </motion.span>
            </motion.h1>

            <p className="mt-8 max-w-[270px] text-[13px] leading-[1.4] text-white/78">
              {hero.introText}
            </p>
          </div>

          <div className="md:col-span-4 md:text-right flex flex-col md:items-end gap-6">
            <p className="text-2xl leading-[1.12] text-white/86 font-normal whitespace-pre-line">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
            <ButtonArrow
              label={hero.secondaryCTA.label}
              href={hero.secondaryCTA.href}
              onClick={onTalk}
              variant="light"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
