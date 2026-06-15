import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CTAButtonProps = {
  href: string
  children: ReactNode
  variant?: 'white' | 'matcha'
  className?: string
}

export function CTAButton({
  href,
  children,
  variant = 'white',
  className,
}: CTAButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-transform active:scale-95 sm:px-8 sm:py-3.5 sm:text-base',
        variant === 'white' &&
          'bg-white text-[var(--text-dark)] hover:bg-white/90',
        variant === 'matcha' &&
          'bg-[var(--matcha)] text-white hover:bg-[var(--matcha)]/90',
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight
        className="size-4 transition-transform group-hover:translate-x-1 sm:size-5"
        aria-hidden
      />
    </a>
  )
}
