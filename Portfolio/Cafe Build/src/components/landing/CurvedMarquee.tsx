import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

type CurvedMarqueeProps = {
  labels: string[]
  className?: string
  speed?: number
}

export function CurvedMarquee({
  labels,
  className,
  speed = 28,
}: CurvedMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const items = labels.length > 0 ? labels : ['Premium Matcha']

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return

      const half = track.scrollWidth / 2
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: -half,
          duration: speed,
          ease: 'none',
          repeat: -1,
        },
      )
    },
    { scope: containerRef, dependencies: [items.join('|'), speed] },
  )

  const renderRow = (keyPrefix: string) =>
    items.map((label, i) => (
      <span
        key={`${keyPrefix}-${label}-${i}`}
        className="mx-6 inline-flex shrink-0 items-center gap-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-dark)] sm:text-base"
      >
        <span>{label}</span>
        <span className="size-2 rounded-full bg-[var(--text-dark)]" aria-hidden />
      </span>
    ))

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden', className)}
      aria-hidden
    >
      <div className="relative -rotate-1 scale-[1.02] rounded-[999px] bg-[var(--lime)] py-3 shadow-[0_8px_32px_rgba(232,243,63,0.35)] sm:py-4">
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex w-max whitespace-nowrap">
            {renderRow('a')}
            {renderRow('b')}
          </div>
        </div>
      </div>
    </div>
  )
}
