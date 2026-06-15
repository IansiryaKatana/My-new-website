import { useCms } from '#/contexts/CmsContext'
import { CTAButton } from './CTAButton'
import { cn } from '#/lib/utils'

export function CapabilitiesSection() {
  const { snapshot } = useCms()
  if (!snapshot) return null
  const { capabilities, services } = snapshot

  return (
    <section
      id="capabilities"
      className="relative min-h-[560px] overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center image-cinematic"
        style={{ backgroundImage: `url(${capabilities.background_image_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-verden-deep/90 via-verden-deep/75 to-verden-deep/40" />

      <div className="relative section-pad">
        <div className="max-editorial grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <p className="text-[11px] uppercase tracking-widest text-white/70">
              {capabilities.eyebrow}
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.25rem)] font-normal tracking-[-0.035em]">
              {capabilities.heading}
            </h2>
            {capabilities.body && (
              <p className="mt-4 max-w-md text-xs leading-relaxed text-white/75">
                {capabilities.body}
              </p>
            )}
            <div className="mt-6">
              <CTAButton label={capabilities.cta_label} href={capabilities.cta_url} />
            </div>
          </div>

          <div className="w-full max-w-[520px] justify-self-end rounded-[4px] bg-white p-7 shadow-[0_24px_60px_rgba(0,0,0,0.18)] lg:ml-auto">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-medium text-verden-deep">
                {capabilities.services_card_title}
              </h3>
              <span className="text-[10px] text-verden-muted">
                {String(services.length).padStart(2, '0')} services
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={cn(
                    'rounded-[2px] border px-3 py-2 text-[11px] transition-colors',
                    service.active
                      ? 'border-verden-pale bg-verden-pale text-verden-ink'
                      : 'border-[#e5e5e5] bg-[#f9f9f6] text-verden-ink hover:border-verden-pale hover:bg-verden-pale/50',
                  )}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
