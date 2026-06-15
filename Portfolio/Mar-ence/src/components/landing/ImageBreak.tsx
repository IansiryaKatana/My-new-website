import { useCms } from '#/contexts/CmsContext'
import { RevealImage } from './Reveal'

export function ImageBreak() {
  const { snapshot } = useCms()
  const { imageBreak } = snapshot

  return (
    <section className="pb-20 md:pb-[100px]">
      <div className="container-valence">
        <RevealImage
          src={imageBreak.image}
          alt={imageBreak.alt}
          className="w-full h-[320px] md:h-[520px]"
        />
      </div>
    </section>
  )
}
