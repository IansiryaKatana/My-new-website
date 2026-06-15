import type { ReactNode } from 'react'

export function AdminPageHeading({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl font-black uppercase tracking-[-0.03em]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl font-sans text-sm text-[var(--admin-fg-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

