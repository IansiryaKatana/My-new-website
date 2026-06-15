import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type AdminModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: AdminModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto border border-[var(--admin-cream)]/20 bg-[var(--admin-surface)] p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2"
          style={{ marginBottom: 0 }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <Dialog.Title className="font-display text-2xl font-black uppercase">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="inline-flex h-9 w-9 items-center justify-center border border-[var(--admin-cream)]/40 text-[var(--admin-cream)] hover:bg-[var(--admin-cream)] hover:text-[var(--admin-dark)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div className="grid gap-4">{children}</div>
          {footer ? (
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[var(--admin-cream)]/15 pt-4">
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

