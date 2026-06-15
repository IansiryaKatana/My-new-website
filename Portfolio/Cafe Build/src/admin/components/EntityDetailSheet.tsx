import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminBtnIcon, adminBtnSecondary } from '../adminClassNames'

interface EntityDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function EntityDetailSheet({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: EntityDetailSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => onOpenChange(false)}
        />
        <Dialog.Content
          className={cn(
            'fixed z-50 flex max-h-[92vh] w-full flex-col overflow-hidden',
            'border border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] shadow-[var(--admin-shadow)]',
            'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:mb-0 max-md:rounded-t-[var(--admin-radius-lg)] max-md:rounded-b-none',
            'md:bottom-0 md:right-0 md:top-0 md:max-h-none md:w-[min(28rem,100vw)] md:rounded-none md:border-l',
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border)] px-5 py-4">
            <Dialog.Title className="text-lg font-semibold text-[var(--admin-text)]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className={adminBtnIcon} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-[var(--admin-text)]">
            {children}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[var(--admin-border)] px-5 py-4">
            <button type="button" className={adminBtnSecondary} onClick={() => onOpenChange(false)}>
              Close
            </button>
            {footer}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface DetailFieldProps {
  label: string
  value: React.ReactNode
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
        {label}
      </p>
      <div className="text-[var(--admin-text)]">{value ?? '—'}</div>
    </div>
  )
}
