import { PortfolioNavbar } from '@/features/portfolio/components/PortfolioNavbar'
import { PortfolioHero } from '@/features/portfolio/components/PortfolioHero'
import { AiAssistantCard } from '@/features/portfolio/components/AiAssistantCard'
import { SavingsPromoCard } from '@/features/portfolio/components/SavingsPromoCard'
import { TotalBalanceCard } from '@/features/portfolio/components/TotalBalanceCard'
import { HoldingsCard } from '@/features/portfolio/components/HoldingsCard'
import { AddAccountSheet } from '@/features/portfolio/components/AddAccountSheet'
import { PortfolioLoadingSkeleton } from '@/features/portfolio/components/PortfolioLoadingSkeleton'
import { usePortfolioOverview } from '@/features/portfolio/hooks/usePortfolioOverview'
import { usePortfolioUiStore } from '@/features/portfolio/store/portfolio-ui.store'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Portfolio data is not available yet.'
}

export function PortfolioPage() {
  const selectedRange = usePortfolioUiStore((state) => state.selectedRange)
  const { data, isLoading, isError, error, refetch, isFetching } =
    usePortfolioOverview(selectedRange)

  if (isLoading) {
    return <PortfolioLoadingSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)]">
        <div className="orizon-hero-bg pb-10">
          <PortfolioNavbar />
        </div>
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[20px] bg-card p-6 shadow-[0_20px_70px_rgba(15,36,25,0.05)]">
            <h2 className="text-lg font-semibold text-foreground">
              Portfolio data not connected yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{getErrorMessage(error)}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              When you are ready, apply the SQL files in{' '}
              <code>supabase/migrations</code> to your Supabase project, then
              refresh this page.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-[var(--jungle-800)]"
            >
              Retry connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="orizon-hero-bg">
        <PortfolioNavbar />
        <PortfolioHero wallets={data.wallets} />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-3 pb-8 pt-4 sm:px-4 sm:pt-6 lg:px-6">
        {isFetching ? (
          <p className="mb-3 text-center text-xs text-muted-foreground">Updating chart...</p>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.75fr)_minmax(0,1.25fr)]">
          <div className="order-3 flex flex-col gap-3 md:order-4 lg:order-1">
            <AiAssistantCard />
            <SavingsPromoCard />
          </div>

          <div className="order-1 min-w-0 md:col-span-2 lg:order-2 lg:col-span-1">
            <TotalBalanceCard
              totalBalance={data.totalBalance}
              balanceHistory={data.balanceHistory}
            />
          </div>

          <div className="order-2 min-w-0 md:order-3 lg:order-3">
            <HoldingsCard holdings={data.holdings} />
          </div>
        </div>
      </section>

      <AddAccountSheet />
    </div>
  )
}
