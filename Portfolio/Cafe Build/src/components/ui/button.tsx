import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[11px] font-bold uppercase tracking-[0.14em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lime)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-white text-[var(--text-dark)] hover:scale-[0.96] active:scale-[0.94]',
        matcha:
          'bg-[var(--deep-green)] text-white hover:scale-[0.96] active:scale-[0.94]',
        lime: 'bg-[var(--lime)] text-[var(--text-dark)] hover:scale-[0.96]',
        outline:
          'border border-white/40 bg-transparent text-white hover:bg-white/10',
        ghost: 'bg-transparent text-inherit hover:bg-black/5',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-[10px]',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10 rounded-full p-0',
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
