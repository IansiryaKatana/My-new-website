import { PortfolioNavbar } from '@/features/portfolio/components/PortfolioNavbar'

function Block({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className ?? ''}`} />
}

export function PortfolioLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="orizon-hero-bg pb-6 sm:pb-8">
        <PortfolioNavbar />
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Block className="h-8 w-32 bg-white/20" />
            <Block className="h-9 w-full bg-white/15 sm:w-24" />
          </div>
          <div className="mt-6 flex gap-4 overflow-hidden sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-[260px] flex-1 snap-start sm:min-w-0">
                <Block className="mb-3 h-3 w-20" />
                <Block className="mb-2 h-9 w-28 bg-white/20" />
                <Block className="mb-4 h-3 w-24" />
                <Block className="h-[72px] w-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-3 pb-8 pt-4 sm:px-4 sm:pt-6 lg:px-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.75fr)_minmax(0,1.25fr)]">
          <div className="order-3 space-y-3 md:order-4 lg:order-1">
            <div className="h-[136px] animate-pulse rounded-[20px] bg-card" />
            <div className="h-[136px] animate-pulse rounded-[20px] bg-card" />
          </div>
          <div className="order-1 md:col-span-2 lg:order-2 lg:col-span-1">
            <div className="min-h-[282px] animate-pulse rounded-[20px] bg-card" />
          </div>
          <div className="order-2 md:order-3 lg:order-3">
            <div className="min-h-[282px] animate-pulse rounded-[20px] bg-card" />
          </div>
        </div>
      </section>
    </div>
  )
}
