import type { CmsMetric } from '#/lib/cms/types'

type MetricsCardProps = {
  metrics: CmsMetric[]
  thumbnailUrl?: string
}

export function MetricsCard({ metrics, thumbnailUrl }: MetricsCardProps) {
  const featured = metrics.find((m) => m.featured) ?? metrics[0]
  const others = metrics.filter((m) => m.id !== featured?.id).slice(0, 2)

  return (
    <div className="glass-card grid h-[220px] w-full max-w-[330px] grid-cols-2 grid-rows-[auto_1fr_auto] gap-3 rounded p-4 text-white">
      {thumbnailUrl && (
        <div
          className="col-span-1 row-span-1 h-14 w-full rounded bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        />
      )}
      {featured && (
        <div className="col-span-1 flex flex-col justify-end">
          <p className="text-3xl font-normal tracking-tight">{featured.value}</p>
          <p className="text-[10px] text-white/70">{featured.label}</p>
        </div>
      )}
      <div className="col-span-2 row-start-3 flex gap-6 border-t border-white/10 pt-3">
        {others.map((m) => (
          <div key={m.id}>
            <p className="text-xl tracking-tight">{m.value}</p>
            <p className="text-[10px] text-white/65">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
