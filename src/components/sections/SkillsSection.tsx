import { useCallback, useEffect, useRef, useState } from 'react'
import { useSkillGroups } from '../../contexts/CmsContext'
import { getMarketingSection, useMarketingPage } from '../../lib/cms/useMarketingPage'
import { cn } from '../../lib/utils'
import { SectionHeading } from '../layout/SectionHeading'

type StackSection = {
  eyebrow: string
  title: string
  description: string
}

export function SkillsSection() {
  const skillGroups = useSkillGroups()
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(skillGroups.length > 2)
  const [activeIndex, setActiveIndex] = useState(0)
  const homePage = useMarketingPage('home')
  const section = getMarketingSection<StackSection>(homePage, 'stack', {
    eyebrow: 'Stack & craft',
    title: 'Tools chosen for velocity without sacrificing quality',
    description:
      'Pragmatic full stack choices — typed frontends, dependable APIs, and observability from day one.',
  })

  const updateScrollState = useCallback(() => {
    const node = carouselRef.current
    if (!node) return

    const maxScrollLeft = node.scrollWidth - node.clientWidth
    setCanScrollPrev(node.scrollLeft > 0)
    setCanScrollNext(node.scrollLeft < maxScrollLeft - 1)

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
  }, [])

  useEffect(() => {
    const node = carouselRef.current
    if (!node) return

    updateScrollState()
    node.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      node.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [skillGroups.length, updateScrollState])

  const scrollByPage = (direction: 'prev' | 'next') => {
    const node = carouselRef.current
    if (!node) return
    const offset = direction === 'next' ? node.clientWidth : -node.clientWidth
    node.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const scrollToIndex = (index: number) => {
    const node = carouselRef.current
    if (!node) return

    const card = node.children.item(index) as HTMLElement | null
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    setActiveIndex(index)
  }

  return (
    <section
      id="stack"
      className="bg-[#765F47] px-6 py-20 text-[#D8D7C3] sm:px-10 lg:px-16"
      aria-labelledby="stack-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />

        <div className="mt-12">
          <div className="mb-4 hidden justify-end gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollByPage('prev')}
              disabled={!canScrollPrev}
              className="inline-flex h-10 w-10 items-center justify-center border border-[#D8D7C3]/30 text-xl leading-none transition disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Show previous skill cards"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={() => scrollByPage('next')}
              disabled={!canScrollNext}
              className="inline-flex h-10 w-10 items-center justify-center border border-[#D8D7C3]/30 text-xl leading-none transition disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Show next skill cards"
            >
              &#8594;
            </button>
          </div>

          <div
            ref={carouselRef}
            className="scrollbar-hidden flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
          >
            {skillGroups.map((group) => (
              <article
                key={group.title}
                className="w-full shrink-0 snap-start border border-[#D8D7C3]/20 bg-[#10140D]/20 p-6 sm:p-8 md:w-[calc((100%-1.5rem)/2)]"
              >
                <h3 className="font-display text-2xl font-black uppercase">{group.title}</h3>
                <ul className="mt-6 grid gap-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between border-b border-[#D8D7C3]/15 pb-3 font-display text-sm font-black uppercase tracking-[0.08em]"
                    >
                      {item}
                      <span aria-hidden="true" className="text-[#D8D7C3]/40">
                        +
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {skillGroups.length > 1 ? (
            <div className="mt-4 flex justify-center gap-2 sm:hidden">
              {skillGroups.map((group, index) => (
                <button
                  key={group.title}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    index === activeIndex
                      ? 'w-6 bg-[#D8D7C3]'
                      : 'w-1.5 bg-[#D8D7C3]/35',
                  )}
                  aria-label={`Show ${group.title} skills`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
