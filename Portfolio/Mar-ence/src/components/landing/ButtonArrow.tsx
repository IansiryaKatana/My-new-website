import { ArrowUpRight } from 'lucide-react'
import { cn } from '#/lib/utils'

type ButtonArrowProps = {
  label: string
  href?: string
  variant?: 'light' | 'dark'
  onClick?: () => void
  className?: string
}

export function ButtonArrow({
  label,
  href = '#',
  variant = 'light',
  onClick,
  className,
}: ButtonArrowProps) {
  const isLight = variant === 'light'

  const labelEl = onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-[18px] h-8 text-[10px] tracking-wide transition-all duration-240',
        isLight
          ? 'bg-white text-valence-navy group-hover:bg-gray-100'
          : 'bg-valence-navy text-white group-hover:bg-[#0a1f38]',
      )}
    >
      {label}
    </button>
  ) : (
    <a
      href={href}
      className={cn(
        'inline-flex items-center px-[18px] h-8 text-[10px] tracking-wide transition-all duration-240',
        isLight
          ? 'bg-white text-valence-navy group-hover:bg-gray-100'
          : 'bg-valence-navy text-white group-hover:bg-[#0a1f38]',
      )}
    >
      {label}
    </a>
  )

  return (
    <div className={cn('inline-flex items-stretch group', className)}>
      {labelEl}
      <span
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center transition-all duration-240 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
          isLight ? 'bg-valence-navy text-white' : 'bg-white text-valence-navy',
        )}
        aria-hidden
      >
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </div>
  )
}
