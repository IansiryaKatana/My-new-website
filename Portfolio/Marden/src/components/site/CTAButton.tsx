import { ArrowUpRight } from 'lucide-react'
import { cn } from '#/lib/utils'

type CTAButtonProps = {
  label: string
  href?: string
  className?: string
  onClick?: () => void
}

export function CTAButton({ label, href = '#', className, onClick }: CTAButtonProps) {
  const cls = cn(
    'group inline-flex h-7 items-center gap-1.5 rounded-[2px] bg-verden-pale px-3 text-[11px] text-verden-ink transition-colors hover:bg-[#e8f88a]',
    className,
  )
  const content = (
    <>
      <span>{label}</span>
      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  )
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick}>
        {content}
      </button>
    )
  }
  return (
    <a href={href} className={cls}>
      {content}
    </a>
  )
}
