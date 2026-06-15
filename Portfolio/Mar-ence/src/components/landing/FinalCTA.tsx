import { useCms } from '#/contexts/CmsContext'
import { Reveal } from './Reveal'
import { ButtonArrow } from './ButtonArrow'

export function FinalCTA({ onSubmit }: { onSubmit: () => void }) {
  const { snapshot } = useCms()
  const cta = snapshot.finalCTA

  return (
    <section
      id="submit"
      className="relative min-h-[380px] flex items-center justify-center text-center px-6"
    >
      <div
        className="absolute inset-0 bg-cover bg-center image-editorial"
        style={{
          backgroundImage: `linear-gradient(rgba(5,18,35,.72), rgba(5,18,35,.72)), url(${cta.backgroundImage})`,
        }}
      />
      <div className="relative z-10 max-w-[760px] py-16">
        <Reveal>
          <h2 className="text-2xl md:text-[28px] leading-[1.25] font-normal text-white mb-8">
            {cta.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex justify-center">
            <ButtonArrow
              label={cta.button.label}
              onClick={onSubmit}
              variant="light"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
