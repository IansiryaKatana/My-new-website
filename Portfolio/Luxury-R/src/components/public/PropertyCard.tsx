import type { Property } from '@/lib/cms/types'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function PropertyCard({ property }: { property: Property }) {
  const badges = [
    `${property.features.bedrooms} bd`,
    `${property.features.bathrooms} ba`,
    property.features.area,
    property.features.year,
  ].filter(Boolean)

  return (
    <article className="group relative min-h-[280px] overflow-hidden md:min-h-[400px]">
      <img
        src={property.image}
        alt={property.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 transition-colors group-hover:from-black/85" />

      <div className="relative flex h-full min-h-[280px] flex-col justify-between p-6 md:min-h-[400px] md:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.14em] text-white/80">
            {property.location}
          </span>
          {property.status && (
            <span className="border border-white/40 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-white">
              {property.status}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-display text-3xl uppercase tracking-[-0.04em] text-white md:text-5xl">
            {property.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            {property.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className="border border-white/30 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-white"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-2xl text-white md:text-3xl">
              from {formatPrice(property.priceFrom)}
            </p>
            <Button variant="white" size="sm">
              View property
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
