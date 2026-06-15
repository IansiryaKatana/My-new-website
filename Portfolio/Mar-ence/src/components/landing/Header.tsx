import { Menu, Plus } from 'lucide-react'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useCms } from '#/contexts/CmsContext'
import { Button } from '#/components/ui/button'
import { ButtonArrow } from './ButtonArrow'

export function Header({ onSubmit }: { onSubmit: () => void }) {
  const { snapshot } = useCms()
  const { hero } = snapshot
  const [mobileOpen, setMobileOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-40 h-16"
      initial={reduced ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-valence flex h-full items-center justify-between px-0">
        <a href="#" className="flex items-center gap-2 text-white/90">
          <span className="flex h-6 w-6 items-center justify-center border border-white/40 text-[10px]">
            V
          </span>
          <span className="text-[11px] tracking-tight">{hero.logoText}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {hero.navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-[11px] text-white/65 tracking-tight hover:text-white/90 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={onSubmit}
            className="h-7 bg-white px-4 text-[10px] text-valence-navy tracking-wide hover:bg-white/90 transition-colors"
          >
            {hero.primaryCTA.label}
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center bg-white/10 text-white border border-white/20"
            aria-label="Menu actions"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-valence-navy/95 backdrop-blur-sm border-t border-white/10 p-6 flex flex-col gap-4">
          {hero.navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm text-white/80"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <ButtonArrow
            label={hero.primaryCTA.label}
            onClick={() => {
              setMobileOpen(false)
              onSubmit()
            }}
            variant="light"
          />
        </div>
      )}
    </motion.header>
  )
}
