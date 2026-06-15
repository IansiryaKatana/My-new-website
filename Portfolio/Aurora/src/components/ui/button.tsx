import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-[-0.01em] transition-all duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-forest text-aurora-white hover:bg-deep-green focus-visible:outline-forest',
        lime: 'bg-lime-card text-deep-green hover:bg-cream-green focus-visible:outline-lime-card',
        cream: 'bg-aurora-white/90 text-forest hover:bg-white focus-visible:outline-aurora-white',
        ghost: 'bg-transparent text-current hover:bg-current/10 focus-visible:outline-current',
        outline: 'border border-charcoal/15 bg-transparent text-charcoal hover:bg-charcoal hover:text-aurora-white focus-visible:outline-charcoal',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-5',
        lg: 'h-12 px-6',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
