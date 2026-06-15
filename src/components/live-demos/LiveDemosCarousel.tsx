import { useCallback, useEffect, useRef, useState } from 'react'

import type { Project } from '../../data/projects'
import { cn } from '../../lib/utils'
import { CarouselDotNav } from '../ui/CarouselDotNav'

import { LiveDemoCard } from './LiveDemoCard'
type LiveDemosCarouselProps = {
  projects: Project[]
  className?: string
  /** Homepage section: full-width track with three cards visible on large screens. */
  variant?: 'default' | 'featured'
}

function getCardClassName(variant: LiveDemosCarouselProps['variant']) {
  if (variant === 'featured') {
    return 'w-[min(82vw,520px)] sm:w-[min(48vw,520px)] lg:w-[calc((100%-2rem)/3)]'
  }

  return 'w-[min(82vw,520px)] sm:w-[min(48vw,520px)]'
}

export function LiveDemosCarousel({
  projects,
  className,
  variant = 'default',
}: LiveDemosCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    const node = carouselRef.current
    if (!node || projects.length === 0) return

    const cards = Array.from(node.children) as HTMLElement[]
    if (cards.length === 0) return

    const scrollLeft = node.scrollLeft
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }, [projects.length])

  useEffect(() => {
    const node = carouselRef.current
    if (!node) return

    updateActiveIndex()
    node.addEventListener('scroll', updateActiveIndex, { passive: true })
    window.addEventListener('resize', updateActiveIndex)

    return () => {
      node.removeEventListener('scroll', updateActiveIndex)
      window.removeEventListener('resize', updateActiveIndex)
    }
  }, [updateActiveIndex])

  const scrollToIndex = (index: number) => {
    const node = carouselRef.current
    if (!node) return

    const card = node.children.item(index) as HTMLElement | null
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    setActiveIndex(index)
  }

  if (projects.length === 0) return null

  return (
    <div className={cn('grid gap-6', className)}>
      <div
        ref={carouselRef}
        className="scrollbar-hidden flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {projects.map((project) => (
          <LiveDemoCard
            key={project.slug}
            project={project}
            className={getCardClassName(variant)}
          />
        ))}
      </div>

      <CarouselDotNav
        items={projects.map((project) => ({
          id: project.slug,
          label: `Show ${project.title} demo`,
        }))}
        activeIndex={activeIndex}
        onSelect={scrollToIndex}
        tone="light"
      />
    </div>
  )
}
