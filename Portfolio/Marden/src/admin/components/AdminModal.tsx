import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'

type AdminModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  onSave?: () => void
  saveLabel?: string
  saving?: boolean
  saveError?: string | null
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  onSave,
  saveLabel = 'Save',
  saving,
  saveError,
}: AdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        {saveError && <p className="text-xs text-red-600">{saveError}</p>}
        <DialogFooter>
          {footer ?? (
            <>
              <Button variant="adminGhost" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {onSave && (
                <Button variant="admin" type="button" disabled={saving} onClick={onSave}>
                  {saving ? 'Saving…' : saveLabel}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
