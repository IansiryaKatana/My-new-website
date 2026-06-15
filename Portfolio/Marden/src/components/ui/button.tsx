import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verden-pale/60 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-verden-pale text-verden-ink hover:bg-[#e8f88a]',
        ghost: 'bg-transparent text-white hover:bg-white/10',
        outline: 'border border-verden-soft bg-transparent text-verden-deep hover:border-verden-pale',
        admin: 'bg-[var(--admin-primary)] text-white hover:opacity-90 rounded-[var(--admin-radius-sm)]',
        adminGhost: 'border border-[var(--admin-border)] bg-transparent text-[var(--admin-text)] hover:bg-[var(--admin-surface-muted)] rounded-[var(--admin-radius-sm)]',
      },
      size: {
        default: 'h-7 px-3 rounded-[2px]',
        sm: 'h-6 px-2 text-[10px]',
        lg: 'h-9 px-4',
        icon: 'h-7 w-7',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
