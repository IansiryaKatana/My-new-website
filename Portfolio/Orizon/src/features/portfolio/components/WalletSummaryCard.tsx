import { motion } from 'motion/react'

import { MiniSparkline } from '@/features/portfolio/components/MiniSparkline'
import type { WalletSummary } from '@/features/portfolio/types/portfolio.types'
import { cn } from '@/lib/utils'

const walletIcons: Record<string, string> = {
  coinbase: 'C',
  trust: 'T',
  metamask: 'M',
  crypto: '₿',
}

type WalletSummaryCardProps = {
  wallet: WalletSummary
  index: number
  isLast?: boolean
}

export function WalletSummaryCard({
  wallet,
  index,
  isLast,
}: WalletSummaryCardProps) {
  const isPositive = wallet.changePercent >= 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group min-w-[260px] flex-1 snap-start px-3 transition hover:bg-white/[0.035] sm:min-w-0 sm:px-0 sm:pr-7',
        !isLast && 'sm:border-r sm:border-white/12',
      )}
    >
      <div className="flex items-center gap-2 text-[10px] text-white/55">
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-white/15 text-[9px] font-semibold text-white">
          {walletIcons[wallet.iconKey] ?? wallet.provider.slice(0, 1)}
        </span>
        <span>{wallet.label}</span>
      </div>

      <div className="mt-2 text-[28px] font-light tracking-[-0.06em] text-white sm:text-[34px]">
        ${wallet.balance.toFixed(2)}
      </div>

      <div className="mt-1 flex items-center gap-2 text-[10px] text-white/55">
        <span className={cn(isPositive ? 'text-[var(--success-green)]' : 'text-red-300')}>
          {isPositive ? '+' : ''}
          {wallet.changePercent.toFixed(2)}
        </span>
        <span>{wallet.updatedAt}</span>
      </div>

      <div className="mt-3 opacity-90 transition group-hover:opacity-100">
        <MiniSparkline data={wallet.sparkline} />
      </div>
    </motion.article>
  )
}
