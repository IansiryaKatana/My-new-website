import type { ReactNode } from 'react'

type HeroBadgeProps = {
  text: string
}

export function HeroBadge({ text }: HeroBadgeProps) {
  if (!text.trim()) return null

  return (
    <div
      className="hero-badge pointer-events-none absolute z-[6] hidden lg:block"
      style={{ left: '62%', top: '58%' }}
      aria-hidden="true"
    >
      <div className="flex h-[150px] w-[150px] rotate-[8deg] items-center justify-center rounded-full bg-[#D8D7C3] font-display text-[72px] font-black italic text-[#11140F]">
        {text}
      </div>
    </div>
  )
}

