import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AdminPageHeadingProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeading({
  title,
  description,
  actions,
  className,
}: AdminPageHeadingProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text)]">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-[var(--admin-text-muted)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
