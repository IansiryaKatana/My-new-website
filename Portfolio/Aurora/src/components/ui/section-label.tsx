import { cn } from '@/lib/utils'

type SectionLabelProps = {
  children: string
  className?: string
  year?: string
}

export function SectionLabel({ children, className, year = '2025' }: SectionLabelProps) {
  return (
    <div className={cn('mb-8 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-muted', className)}>
      <span>{children}</span>
      <span>{year}</span>
    </div>
  )
}
