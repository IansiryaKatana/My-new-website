import { useCms } from '#/contexts/CmsContext'
import { CTAButton } from './CTAButton'

export function GlobalMapSection() {
  const { snapshot } = useCms()
  if (!snapshot) return null
  const { mapSection, mapLocations } = snapshot

  return (
    <section id="map" className="relative overflow-hidden bg-verden-deep section-pad text-white">
      <div className="max-editorial relative z-10">
        <h2 className="max-w-lg text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.035em]">
          {mapSection.heading}
        </h2>
        <div className="mt-6">
          <CTAButton label={mapSection.cta_label} href={mapSection.cta_url} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 opacity-30">
        <svg
          viewBox="0 0 1000 400"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            d="M120,200 Q250,120 400,180 T700,160 T920,200"
            fill="none"
            stroke="rgba(180,230,205,0.35)"
            strokeWidth="1"
          />
          <path
            d="M80,260 Q300,220 500,250 T900,240"
            fill="none"
            stroke="rgba(180,230,205,0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative mx-auto mt-8 h-[280px] max-w-[1440px] md:h-[360px]">
        {mapLocations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            title={`${loc.country}${loc.region ? ` — ${loc.region}` : ''}`}
            className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125 ${
              loc.status === 'active'
                ? 'bg-verden-pale shadow-[0_0_12px_rgba(221,246,154,0.6)]'
                : 'bg-white/90'
            }`}
            style={{ left: `${loc.x_percent}%`, top: `${loc.y_percent}%` }}
            aria-label={loc.country}
          />
        ))}
      </div>
    </section>
  )
}
