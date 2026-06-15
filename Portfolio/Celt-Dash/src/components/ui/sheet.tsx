import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type * as React from 'react'

import { cn } from '#/lib/utils'

function Sheet({ children, onOpenChange, open }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      {children}
    </DialogPrimitive.Root>
  )
}

function SheetTrigger({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
}

function SheetContent({
  children,
  className,
  side = 'right',
  title,
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: 'right' | 'bottom'
  title: string
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col border-orange-200/10 bg-[linear-gradient(145deg,#211007,#090604)] text-cream shadow-[0_30px_90px_rgba(0,0,0,0.58)] outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-full max-w-xl border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-[560px]',
          side === 'bottom' &&
            'inset-x-0 bottom-0 max-h-[92vh] rounded-t-2xl border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className,
        )}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-cream/70 transition hover:text-cream">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function SheetHeader({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('border-b border-white/10 p-5 pr-16', className)} {...props}>
      {children}
    </div>
  )
}

function SheetBody({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex-1 overflow-y-auto p-5', className)} {...props}>
      {children}
    </div>
  )
}

function SheetFooter({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('border-t border-white/10 p-5', className)} {...props}>
      {children}
    </div>
  )
}

export { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTrigger }
