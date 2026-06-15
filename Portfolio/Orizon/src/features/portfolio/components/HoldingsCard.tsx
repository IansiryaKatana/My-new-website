import { ChevronRight } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import { motion } from 'motion/react'

import { ClientOnly } from '@/components/ClientOnly'
import { ScrollProgressPanel } from '@/components/ScrollProgressPanel'
import { Card } from '@/components/ui/card'
import type { Holding } from '@/features/portfolio/types/portfolio.types'

type HoldingRowProps = {
  holding: Holding
  mode: 'value' | 'performance'
}

function HoldingSparkline({ data }: { data: Holding['sparkline'] }) {
  const chartData = data.map((point) => ({ value: point.value }))

  return (
    <ClientOnly fallback={<div className="h-8 w-16 rounded bg-[var(--jungle-100)]" />}>
      <div className="h-8 w-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis hide domain={['dataMin', 'dataMax']} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--jungle-600)"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  )
}

export function HoldingRow({ holding, mode }: HoldingRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] py-3 last:border-b-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{
            backgroundColor: holding.iconBg,
            color: holding.iconColor,
          }}
        >
          {holding.symbol.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">
            {holding.name}
          </p>
          {holding.network ? (
            <p className="truncate text-[10px] text-muted-foreground">
              {holding.network}
            </p>
          ) : null}
        </div>
      </div>

      {mode === 'value' ? (
        <p className="shrink-0 text-[13px] font-medium text-foreground">
          ${holding.currentValue.toFixed(2)}
        </p>
      ) : (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HoldingSparkline data={holding.sparkline} />
          <p className="text-[13px] font-medium text-foreground">
            {holding.changePercent.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  )
}

type HoldingsCardProps = {
  holdings: Holding[]
}

export function HoldingsCard({ holdings }: HoldingsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="h-full min-h-[282px]"
    >
      <Card className="flex h-full min-h-[282px] flex-col border-0 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,36,25,0.08)] sm:p-[22px]">
        <ScrollProgressPanel
          header={
            <div className="flex items-center justify-between gap-3 pb-3">
              <h3 className="text-lg font-medium text-foreground">Holding</h3>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--jungle-50)] px-3 py-1.5 text-[11px] font-medium text-muted-foreground"
              >
                <span className="hidden sm:inline">See all holding</span>
                <span className="sm:hidden">See all</span>
                <ChevronRight className="size-3.5" strokeWidth={1.7} />
              </button>
            </div>
          }
          bodyClassName="pt-2"
        >
          <p className="text-[11px] font-medium text-muted-foreground">Total Value</p>
          {holdings.map((holding) => (
            <HoldingRow key={`${holding.id}-value`} holding={holding} mode="value" />
          ))}

          <p className="mt-2 text-[11px] font-medium text-muted-foreground">Total Value</p>
          {holdings.map((holding) => (
            <HoldingRow
              key={`${holding.id}-performance`}
              holding={holding}
              mode="performance"
            />
          ))}
        </ScrollProgressPanel>
      </Card>
    </motion.div>
  )
}
