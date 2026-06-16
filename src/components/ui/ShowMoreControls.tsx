import { buttonVariants } from './button'
import { cn } from '../../lib/utils'

type ShowMoreControlsProps = {
  visibleCount: number
  totalCount: number
  batchSize: number
  onShowMore: () => void
  onShowLess: () => void
  className?: string
  variant?: 'light' | 'dark'
}

export function ShowMoreControls({
  visibleCount,
  totalCount,
  batchSize,
  onShowMore,
  onShowLess,
  className,
  variant = 'light',
}: ShowMoreControlsProps) {
  const canShowMore = visibleCount < totalCount
  const canShowLess = visibleCount > batchSize

  if (!canShowMore && !canShowLess) return null

  const btnVariant = variant === 'dark' ? 'dark' : 'light'

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-4', className)}>
      {canShowMore ? (
        <button
          type="button"
          className={buttonVariants({ variant: btnVariant })}
          onClick={onShowMore}
        >
          Show more
        </button>
      ) : null}
      {canShowLess ? (
        <button
          type="button"
          className={buttonVariants({ variant: btnVariant, className: 'opacity-80' })}
          onClick={onShowLess}
        >
          Show less
        </button>
      ) : null}
    </div>
  )
}
