import { WalletSummaryCard } from '@/features/portfolio/components/WalletSummaryCard'
import type { WalletSummary } from '@/features/portfolio/types/portfolio.types'

type WalletSummaryGridProps = {
  wallets: WalletSummary[]
}

export function WalletSummaryGrid({ wallets }: WalletSummaryGridProps) {
  return (
    <div className="scrollbar-hide mt-4 flex snap-x snap-mandatory gap-0 overflow-x-auto pb-2 scroll-smooth sm:mt-6 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
      {wallets.map((wallet, index) => (
        <WalletSummaryCard
          key={wallet.id}
          wallet={wallet}
          index={index}
          isLast={index === wallets.length - 1}
        />
      ))}
    </div>
  )
}
