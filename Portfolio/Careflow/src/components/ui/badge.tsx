import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold leading-none',
  {
    variants: {
      variant: {
        paid: 'bg-[#cfe6d0] text-care-ink',
        unpaid: 'bg-care-danger-soft text-care-ink',
        insurance: 'bg-care-info text-care-ink',
        muted: 'bg-care-green-soft text-care-muted',
      },
    },
    defaultVariants: {
      variant: 'muted',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  )
}

export { Badge, badgeVariants }
