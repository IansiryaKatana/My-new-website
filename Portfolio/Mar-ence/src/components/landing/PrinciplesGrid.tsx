import { useCms } from '#/contexts/CmsContext'
import { Reveal } from './Reveal'

export function PrinciplesGrid() {
  const { snapshot } = useCms()
  const principles = snapshot.principles

  return (
    <section className="border-y border-valence-border">
      <div className="grid md:grid-cols-3">
        {principles.map((p, i) => (
          <Reveal
            key={p.id}
            delay={i * 0.12}
            className="min-h-[220px] md:min-h-[260px] p-7 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-valence-border last:border-r-0"
          >
            <span className="text-[13px] text-[#4f575c]">{p.number}</span>
            <div>
              <h3 className="text-lg tracking-[-0.02em] font-normal mb-3">
                {p.title}
              </h3>
              <p className="text-xs leading-[1.45] text-[#667078] max-w-[320px]">
                {p.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
