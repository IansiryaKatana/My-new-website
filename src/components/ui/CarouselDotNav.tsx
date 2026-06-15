import { cn } from '../../lib/utils'

export type CarouselDotNavItem = {
  id: string
  label: string
}

type CarouselDotNavProps = {
  items: CarouselDotNavItem[]
  activeIndex: number
  onSelect: (index: number) => void
  tone?: 'light' | 'cream'
  className?: string
}

const toneClasses = {
  light: {
    active: 'w-6 bg-white',
    inactive: 'w-1.5 bg-white/35 hover:bg-white/50',
  },
  cream: {
    active: 'w-6 bg-[#D8D7C3]',
    inactive: 'w-1.5 bg-[#D8D7C3]/35',
  },
} as const

export function CarouselDotNav({
  items,
  activeIndex,
  onSelect,
  tone = 'light',
  className,
}: CarouselDotNavProps) {
  if (items.length <= 1) return null

  const colors = toneClasses[tone]

  return (
    <div className={cn('flex justify-center gap-2', className)} role="tablist" aria-label="Carousel">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          onClick={() => onSelect(index)}
          className={cn(
            'h-1 rounded-full transition-all duration-300',
            index === activeIndex ? colors.active : colors.inactive,
          )}
          aria-label={item.label}
          aria-selected={index === activeIndex}
        />
      ))}
    </div>
  )
}
