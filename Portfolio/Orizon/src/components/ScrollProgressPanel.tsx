import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type ScrollProgressPanelProps = {
  header: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}

export function ScrollProgressPanel({
  header,
  children,
  className,
  bodyClassName,
}: ScrollProgressPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const updateProgress = useCallback(() => {
    const element = scrollRef.current
    if (!element) return

    const maxScroll = element.scrollHeight - element.clientHeight
    setProgress(maxScroll > 0 ? element.scrollTop / maxScroll : 0)
  }, [])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    updateProgress()
    element.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      element.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [updateProgress, children])

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div className="shrink-0">{header}</div>
      <div
        className="scroll-progress-track shrink-0"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Scroll progress"
      >
        <div
          className="scroll-progress-fill"
          style={{ width: `${Math.max(progress * 100, progress > 0 ? 8 : 0)}%` }}
        />
      </div>
      <div
        ref={scrollRef}
        className={cn('scrollbar-hide min-h-0 flex-1 overflow-y-auto', bodyClassName)}
      >
        {children}
      </div>
    </div>
  )
}
