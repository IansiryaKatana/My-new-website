import { cn } from '@/lib/utils'

type SiteLogoProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-lg leading-none',
  md: 'text-2xl leading-none',
  lg: 'text-4xl leading-none sm:text-5xl',
}

export function SiteLogo({ className, size = 'md' }: SiteLogoProps) {
  return (
    <a
      href="/"
      className={cn(
        'inline-flex flex-col font-extrabold uppercase tracking-[0.18em] text-white no-underline',
        sizeClasses[size],
        className,
      )}
      aria-label="NGUNJUK home"
    >
      <span>NGUN</span>
      <span>JUK</span>
    </a>
  )
}
