import { Star } from 'lucide-react'

type RatingProps = {
  value: number
  count?: number
  tone?: 'dark' | 'light'
}

export function Rating({ value, count, tone = 'dark' }: RatingProps) {
  return (
    <div className={tone === 'light' ? 'flex items-center gap-2 text-cream-green' : 'flex items-center gap-2 text-forest'}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-3 fill-current" />
        ))}
      </div>
      <span className="text-xs text-current/75">
        {value.toFixed(1)}{count ? ` (${count})` : ''}
      </span>
    </div>
  )
}
