import { useCms } from '#/contexts/CmsContext'
import { Reveal } from './Reveal'

export function InvestmentApproach() {
  const { snapshot } = useCms()
  const approach = snapshot.investmentApproach

  return (
    <section id="process" className="py-20 md:py-24 border-t border-valence-border">
      <div className="container-valence">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 flex flex-col justify-between">
            <Reveal>
              <p className="text-[11px] text-valence-muted">{approach.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-auto pt-12 lg:pt-32">
              <p className="text-xs leading-[1.45] text-[#5f6970] max-w-sm">
                {approach.description}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="text-[34px] leading-[1.05] tracking-[-0.04em] font-normal mb-12">
                {approach.title}
              </h2>
            </Reveal>
            <div className="divide-y divide-[#e1e5e7]">
              {approach.items.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.08}>
                  <div className="grid grid-cols-1 md:grid-cols-[48px_1fr_1.6fr] gap-2 md:gap-4 py-7 items-start">
                    <span className="text-xs text-[#8b9298]">{item.number}</span>
                    <span className="text-[15px] font-medium">{item.title}</span>
                    <p className="text-xs leading-[1.45] text-[#5f6970]">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
