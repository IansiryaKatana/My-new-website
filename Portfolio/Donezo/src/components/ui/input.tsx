import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'h-12 w-full rounded-2xl border-0 bg-white px-4 text-sm text-donezo-ink shadow-[0_8px_20px_rgba(0,0,0,0.03)] outline-none placeholder:text-donezo-muted focus-visible:ring-2 focus-visible:ring-donezo-accent',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export { Input }
