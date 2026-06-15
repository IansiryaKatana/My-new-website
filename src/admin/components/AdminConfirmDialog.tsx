import type { ReactNode } from 'react'

import { adminBtn, adminBtnDanger, adminBtnPrimary } from '../adminClassNames'
import { AdminModal } from './AdminModal'

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = true,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  destructive?: boolean
}) {
  return (
    <AdminModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <>
          <button type="button" className={adminBtn} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={destructive ? adminBtnDanger : adminBtnPrimary}
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="font-sans text-sm text-[#1a1f16]">{description}</div>
    </AdminModal>
  )
}
