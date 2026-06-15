import { cn } from '../lib/utils'

type LogoMarkProps = {
  className?: string
  tone?: 'dark' | 'light'
}

export function LogoMark({ className, tone = 'dark' }: LogoMarkProps) {
  return (
    <span
      className={cn(
        'relative inline-grid size-10 place-items-center rounded-full border',
        tone === 'dark'
          ? 'border-black/15 text-black'
          : 'border-white/30 text-white',
        className,
      )}
      aria-label="Staybil"
    >
      <span className="absolute size-4 rounded-full border border-current" />
      <span className="absolute h-px w-7 rotate-45 bg-current" />
      <span className="sr-only">Staybil</span>
    </span>
  )
}
