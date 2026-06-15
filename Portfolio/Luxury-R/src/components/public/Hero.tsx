import { publicAsset } from '../../../../../demo-assets'
import { useCms } from '@/contexts/CmsContext'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { data } = useCms()
  const { siteSettings, heroStats } = data

  return (
    <section className="relative min-h-[100svh] md:min-h-screen">
      <img
        src={publicAsset(siteSettings.heroImage)}
        alt="Luxury modern estate on a hillside at golden hour"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1320px] flex-col px-5 pb-10 pt-28 md:px-10 md:pt-32">
        <div className="grid flex-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center">
            <h1 className="heading-luxury text-white">
              {siteSettings.heroHeadline.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h1>
            <p className="font-serif-accent mt-4 text-xl text-white/90 md:text-2xl">
              {siteSettings.heroSubheadline}
            </p>
          </div>

          <p className="max-w-xs self-start text-sm leading-relaxed text-white/85 lg:justify-self-end lg:pt-8">
            {siteSettings.heroTrustCopy}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-8 border-t border-white/15 pt-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-8">
            {heroStats.map((stat) => (
              <div key={stat.id} className="text-white">
                <div className="text-2xl font-light tracking-tight md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-white/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <Button variant="white" asChild>
            <a href="#contact">Get in touch</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
