import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-care-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-care-shell disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-care-ink text-white shadow-sm hover:bg-care-ink/85 active:scale-[0.98]',
        secondary:
          'bg-white text-care-ink shadow-sm hover:bg-care-green-soft active:scale-[0.98]',
        ghost:
          'bg-transparent text-care-ink hover:bg-care-green-soft active:scale-[0.98]',
        danger:
          'bg-care-danger text-care-ink shadow-sm hover:bg-care-danger-soft active:scale-[0.98]',
        outline:
          'border border-care-line bg-white/70 text-care-ink hover:bg-white active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        icon: 'size-9 p-0',
        iconSm: 'size-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
