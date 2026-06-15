import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminBtnGhost } from '../adminClassNames'

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: AdminModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!open) {
      setScrollProgress(0)
      return
    }

    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight
      setScrollProgress(max > 0 ? (el.scrollTop / max) * 100 : 0)
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [open, children])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={() => onOpenChange(false)}
        />
        <Dialog.Content
          className={cn(
            'fixed z-50 flex max-h-[92vh] w-full flex-col overflow-hidden',
            'border border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] shadow-[var(--admin-shadow)]',
            'max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:top-auto max-md:mb-0 max-md:rounded-t-[var(--admin-radius-lg)] max-md:rounded-b-none',
            'md:left-1/2 md:top-1/2 md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--admin-radius-lg)]',
            className,
          )}
          onPointerDownOutside={(event) => event.preventDefault()}
        >
          <div className="admin-scroll-progress">
            <div
              className="admin-scroll-progress__bar"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-[var(--admin-border)] px-5 py-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-[var(--admin-text)]">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-[var(--admin-text-muted)]">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close asChild>
              <button type="button" className={adminBtnIcon} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {footer ? (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--admin-border)] px-5 py-4">
              <button type="button" className={adminBtnGhost} onClick={() => onOpenChange(false)}>
                Cancel
              </button>
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
