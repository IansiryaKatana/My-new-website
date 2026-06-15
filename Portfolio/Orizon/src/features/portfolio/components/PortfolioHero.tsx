import { Plus } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WalletSummaryGrid } from '@/features/portfolio/components/WalletSummaryGrid'
import { usePortfolioUiStore } from '@/features/portfolio/store/portfolio-ui.store'
import type { WalletSummary } from '@/features/portfolio/types/portfolio.types'

type PortfolioHeroProps = {
  wallets: WalletSummary[]
}

export function PortfolioHero({ wallets }: PortfolioHeroProps) {
  const { activeTab, setActiveTab, setAddSheetOpen } = usePortfolioUiStore()

  return (
    <section className="orizon-hero-bg relative overflow-hidden pb-6 sm:pb-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col gap-4 px-4 pt-2 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <motion.h1
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-[26px] font-normal tracking-[-0.04em] text-white sm:text-[30px]"
              >
                Portfolio
              </motion.h1>

              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as 'overview' | 'holding')
                }
              >
                <TabsList className="w-full bg-transparent p-0 sm:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="holding">Holding</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button
              variant="pill"
              size="sm"
              onClick={() => setAddSheetOpen(true)}
              className="w-full self-start sm:w-auto sm:self-auto"
            >
              <Plus className="size-3.5" />
              Add
            </Button>
          </div>

          <WalletSummaryGrid wallets={wallets} />
        </div>
      </div>
    </section>
  )
}
