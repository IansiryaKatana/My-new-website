import { Link } from '@tanstack/react-router'
import { buttonVariants } from '../ui/button'
import { cn } from '../../lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  action?: {
    label: string
    to: string
  }
  invert?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  invert = false,
}: SectionHeadingProps) {
  const muted = invert ? 'text-[#11140F]/70' : 'text-[#D8D7C3]/70'
  const text = invert ? 'text-[#11140F]' : 'text-[#D8D7C3]'

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p
          className={`font-display text-sm uppercase tracking-[0.2em] ${muted}`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-4 font-display text-4xl font-black uppercase leading-[0.88] sm:text-6xl ${text}`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`mt-4 max-w-2xl text-base leading-relaxed ${muted}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          to={action.to}
          className={cn(
            buttonVariants({ variant: invert ? 'dark' : 'light', size: 'default' }),
            'group w-fit',
          )}
        >
          {action.label}
          <span
            aria-hidden="true"
            className="ml-4 transition-[color,transform] duration-300 group-hover:translate-x-2"
          >
            ↗
          </span>
        </Link>
      ) : null}
    </div>
  )
}

