import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { adminBtn, adminBtnGhost } from '../adminClassNames'

export function AdminModal({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  saveLabel = 'Save',
  busy,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  children: ReactNode
  onSave?: () => void
  saveLabel?: string
  busy?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        {onSave && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={adminBtnGhost}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={adminBtn}
              disabled={busy}
              onClick={onSave}
            >
              {busy ? 'Saving…' : saveLabel}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
