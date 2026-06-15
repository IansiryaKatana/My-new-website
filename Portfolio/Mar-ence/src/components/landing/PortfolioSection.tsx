import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { useCms } from '#/contexts/CmsContext'
import { cn } from '#/lib/utils'
import { ButtonArrow } from './ButtonArrow'
import { Reveal, RevealImage } from './Reveal'

export function PortfolioSection() {
  const { snapshot } = useCms()
  const portfolio = snapshot.portfolio
  const [activeId, setActiveId] = useState(
    portfolio.selectedItems.find((i) => i.active)?.id ??
      portfolio.selectedItems[0]?.id,
  )

  const activeItem = portfolio.selectedItems.find((i) => i.id === activeId)
  const featured = portfolio.featuredProject

  return (
    <section id="works" className="py-20 md:py-[110px]">
      <div className="container-valence">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="text-[11px] text-valence-muted mb-2">
                {portfolio.eyebrow}
              </p>
              <h2 className="text-[34px] leading-[1.05] tracking-[-0.04em] font-normal mb-10">
                {portfolio.title}
              </h2>
            </Reveal>
            <ul className="space-y-0">
              {portfolio.selectedItems.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.06}>
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={cn(
                        'w-full flex items-center justify-between py-4 border-b border-[#e7eaec] text-xs transition-colors group',
                        activeId === item.id
                          ? 'text-valence-text font-medium'
                          : 'text-[#7a8288]',
                      )}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-9">
            <Reveal className="mb-6 lg:text-right">
              <p className="text-xs leading-[1.5] text-[#5c656c] max-w-[520px] lg:ml-auto">
                {portfolio.introText}
              </p>
            </Reveal>

            <div className="grid md:grid-cols-[2fr_1fr] gap-6">
              <RevealImage
                src={featured.imageLarge}
                alt={featured.title}
                className="h-[360px] md:h-[520px]"
              />
              <RevealImage
                src={featured.imageSide}
                alt=""
                className="h-[280px] md:h-[520px] hidden md:block"
                delay={0.12}
              />
            </div>

            <Reveal className="mt-6 grid md:grid-cols-[1fr_auto] gap-4 items-start">
              <div>
                <h3 className="text-xl tracking-[-0.03em] font-normal mb-2">
                  {activeItem?.name ?? featured.title}
                </h3>
                <p className="text-xs leading-[1.5] text-[#5c656c] max-w-[520px]">
                  {featured.description}
                </p>
              </div>
              <ButtonArrow
                label={featured.cta.label}
                href={featured.cta.href}
                variant="dark"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
