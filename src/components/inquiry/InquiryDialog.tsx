import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ContactForm } from '../contact/ContactForm'
import { useInquiry } from '../../contexts/InquiryContext'
import { Button } from '../ui/button'

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

    return () => {
      el.removeEventListener('scroll', updateProgress)
      observer.disconnect()
    }
  }, [active, updateProgress])

  return { scrollRef, progress }
}

export function InquiryDialog() {
  const { open, options, closeInquiry } = useInquiry()
  const { scrollRef, progress } = useScrollProgress(open)
  const title = options.title ?? 'Start a project'

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && closeInquiry()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#10140D]/55" />
        <Dialog.Content
          className="inquiry-sheet fixed inset-x-0 bottom-0 z-[81] flex max-h-[92vh] flex-col overflow-hidden border border-[#11140F]/15 text-[#11140F] shadow-2xl max-md:rounded-t-none sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-h-[min(90vh,52rem)] sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2"
          style={{ marginBottom: 0 }}
        >
          <div className="inquiry-sheet-header shrink-0 px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="font-display text-2xl font-black uppercase">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-1 font-copy text-sm text-[#11140F]/65">
                  Share a few details — no need to leave this page.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#11140F]/25 text-[#11140F] transition-colors hover:bg-[#11140F] hover:text-[#D8D7C3]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="h-[3px] shrink-0 bg-[#11140F]/10" aria-hidden>
            <div
              className="h-full bg-[#765f47] transition-[width] duration-75"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <div
            ref={scrollRef}
            className="inquiry-sheet-body min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ContactForm
              key={`${options.source ?? 'general'}-${options.sourceRef ?? 'none'}-${open ? 'open' : 'closed'}`}
              inquiry={options}
              onSubmitted={closeInquiry}
              showFooterNote={false}
            />
          </div>

          <div className="inquiry-sheet-footer flex shrink-0 justify-end px-5 py-4 sm:px-6">
            <Dialog.Close asChild>
              <Button type="button" variant="darkMuted">
                Cancel
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
