import { cn } from '../lib/utils'

type SectionLabelProps = {
  children: string
  className?: string
  tone?: 'dark' | 'light'
}

export function SectionLabel({
  children,
  className,
  tone = 'dark',
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        'w-fit border-b pb-2 text-[0.68rem] font-medium uppercase tracking-[0.22em]',
        tone === 'dark'
          ? 'border-black/15 text-muted'
          : 'border-white/20 text-white/70',
        className,
      )}
    >
      {children}
    </p>
  )
}
