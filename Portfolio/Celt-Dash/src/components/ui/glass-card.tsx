import type * as React from 'react'

import { cn } from '#/lib/utils'

type GlassCardProps = React.ComponentProps<'section'> & {
  as?: React.ElementType
  [key: string]: unknown
}

function GlassCard({ as: Comp = 'section', className, ...props }: GlassCardProps) {
  return (
    <Comp
      className={cn(
        'rounded-[1.125rem] border border-orange-200/[0.07] bg-[linear-gradient(145deg,rgba(38,20,10,0.9),rgba(12,9,7,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_18px_40px_rgba(0,0,0,0.36)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300/15 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_rgba(0,0,0,0.42)]',
        className,
      )}
      {...props}
    />
  )
}

export { GlassCard }
