import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type AdminModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

function useScrollProgress(active: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const updateProgress = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    setProgress(max > 0 ? el.scrollTop / max : 0)
  }, [])

  useEffect(() => {
    if (!active) {
      setProgress(0)
      return
    }
    const el = scrollRef.current
    if (!el) return

    updateProgress()
    el.addEventListener('scroll', updateProgress, { passive: true })

    const observer = new ResizeObserver(updateProgress)
    observer.observe(el)
    for (const child of el.children) {
      observer.observe(child)
    }

    return () => {
      el.removeEventListener('scroll', updateProgress)
      observer.disconnect()
    }
  }, [active, updateProgress])

  return { scrollRef, progress }
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: AdminModalProps) {
  const { scrollRef, progress } = useScrollProgress(open)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="admin-sheet-overlay fixed inset-0 z-50" />
        <Dialog.Content
          className="admin-sheet fixed inset-x-0 bottom-0 z-[51] flex max-h-[92vh] flex-col overflow-hidden border border-[#cfd0c4] shadow-2xl max-md:rounded-t-none md:inset-x-auto md:bottom-0 md:right-0 md:top-0 md:max-h-none md:w-[min(32rem,100vw)] md:rounded-none md:border-l md:border-t-0"
          style={{ marginBottom: 0 }}
        >
          <div className="admin-sheet-header shrink-0 px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="font-display text-2xl font-black uppercase text-[#1a1f16]">
                {title}
              </Dialog.Title>
              <Dialog.Close
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#cfd0c4] bg-[#ebeae0] text-[#1a1f16] hover:bg-[#765f47] hover:text-[#d8d7c3]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
          </div>

          <div className="admin-sheet-progress shrink-0" aria-hidden>
            <div
              className="admin-sheet-progress-bar"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <div
            ref={scrollRef}
            className="admin-sheet-scroll admin-sheet-body min-h-0 flex-1 px-6 py-4"
          >
            <div className="grid gap-4 text-[#1a1f16]">{children}</div>
          </div>

          {footer ? (
            <div className="admin-sheet-footer flex shrink-0 flex-wrap justify-end gap-3 px-6 py-4">
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
