import type * as React from 'react'

import { cn } from '#/lib/utils'

type StatusBadgeProps = {
  status: 'Waiting' | 'Delivered' | 'Decline' | 'Positive' | 'Neutral'
  children?: React.ReactNode
}

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  Waiting: 'border-orange-400/20 bg-orange-400/10 text-orange-200 shadow-[0_0_16px_rgba(242,106,46,0.16)]',
  Delivered: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200 shadow-[0_0_16px_rgba(92,199,121,0.13)]',
  Decline: 'border-red-300/20 bg-red-400/10 text-red-200 shadow-[0_0_16px_rgba(216,86,86,0.13)]',
  Positive: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200',
  Neutral: 'border-white/10 bg-white/[0.04] text-cream/60',
}

function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-1 text-[0.625rem] font-medium leading-none',
        statusStyles[status],
      )}
    >
      {children ?? status}
    </span>
  )
}

export { StatusBadge }
