import { useCms } from '#/contexts/CmsContext'
import { Reveal, RevealImage } from './Reveal'

export function PerspectiveSection() {
  const { snapshot } = useCms()
  const p = snapshot.perspective

  return (
    <section id="about" className="py-16 md:py-20">
      <div className="container-valence">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-8 items-end mb-12">
            <div>
              <p className="text-[11px] text-[#6f777d] mb-3">{p.eyebrow}</p>
              <h2 className="text-[34px] leading-[1.05] tracking-[-0.04em] font-normal">
                {p.title}
              </h2>
            </div>
            <p className="text-[13px] leading-[1.45] text-[#3f464b] md:justify-self-end md:max-w-[420px]">
              {p.description}
            </p>
          </div>
        </Reveal>
        <RevealImage
          src={p.image}
          alt={p.title}
          className="w-full h-[320px] md:h-[520px]"
        />
      </div>
    </section>
  )
}
