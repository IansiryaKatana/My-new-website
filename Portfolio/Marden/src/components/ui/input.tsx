import * as React from 'react'
import { cn } from '#/lib/utils'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-9 w-full rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-white px-3 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]/30',
      className,
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'
