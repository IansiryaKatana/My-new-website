import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap font-display text-sm font-black uppercase',
    'transition-[color,background-color,border-color,transform] duration-300',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:transition-colors [&_svg]:duration-300',
  ].join(' '),
  {
    variants: {
      variant: {
        light: [
          'border border-[#D8D7C3] bg-transparent text-[#D8D7C3]',
          'hover:border-[#D8D7C3] hover:bg-[#D8D7C3] hover:text-[#11140F]',
          'focus-visible:outline-[#D8D7C3]',
          'hover:[&_svg]:text-[#11140F]',
        ].join(' '),
        lightMuted: [
          'border border-[#D8D7C3]/30 bg-transparent text-[#D8D7C3]',
          'hover:border-[#D8D7C3] hover:bg-[#D8D7C3]/15 hover:text-[#D8D7C3]',
          'focus-visible:outline-[#D8D7C3]',
        ].join(' '),
        dark: [
          'border border-[#11140F] bg-transparent text-[#11140F]',
          'hover:border-[#11140F] hover:bg-[#11140F] hover:text-[#D8D7C3]',
          'focus-visible:outline-[#11140F]',
          'hover:[&_svg]:text-[#D8D7C3]',
        ].join(' '),
        darkMuted: [
          'border border-[#11140F]/25 bg-transparent text-[#11140F]',
          'hover:border-[#11140F] hover:bg-[#11140F]/10 hover:text-[#11140F]',
          'focus-visible:outline-[#11140F]',
        ].join(' '),
        ghost:
          'border border-transparent bg-transparent text-inherit hover:bg-white/10 hover:text-white',
        outline:
          'border border-current bg-transparent text-current hover:bg-current/10 hover:text-current',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4 text-xs',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'light',
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

