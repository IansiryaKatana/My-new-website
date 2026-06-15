import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-[2rem] border border-line bg-paper p-5 shadow-2xl outline-none data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in md:left-1/2 md:top-1/2 md:bottom-auto md:w-[min(92vw,680px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2rem] md:p-7',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Close
          className="absolute right-5 top-5 inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-ink hover:text-paper"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export const DialogHeader = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('max-w-xl pr-12', className)} {...props} />
)

export const DialogTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn('font-serif text-4xl leading-none text-ink md:text-5xl', className)}
    {...props}
  />
)

export const DialogDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn('mt-4 text-sm leading-7 text-muted', className)}
    {...props}
  />
)
