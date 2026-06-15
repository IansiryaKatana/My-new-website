import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Activity, BarChart3, LineChart as LineChartIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { ClientOnly } from '@/components/ClientOnly'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePortfolioUiStore } from '@/features/portfolio/store/portfolio-ui.store'
import type { BalancePoint, ChartRange } from '@/features/portfolio/types/portfolio.types'
import { cn } from '@/lib/utils'

const ranges: ChartRange[] = ['1W', '1M', '3M', '6M', 'YTD', '1Y']

type TotalBalanceCardProps = {
  totalBalance: number
  balanceHistory: BalancePoint[]
}

function BalanceTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-foreground shadow-lg">
      ${payload[0]?.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </div>
  )
}

export function TotalBalanceCard({
  totalBalance,
  balanceHistory,
}: TotalBalanceCardProps) {
  const { selectedRange, setSelectedRange, chartType, setChartType } =
    usePortfolioUiStore()

  const chartData = balanceHistory.map((point) => ({
    label: point.label ?? `P${point.pointIndex}`,
    value: point.value,
    isActive: point.isActive,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Card className="flex min-h-[282px] flex-col border-0 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,36,25,0.08)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Total balance</p>
            <p className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex shrink-0 gap-2 self-start">
            <Button
              variant="ghost"
              size="iconSm"
              className={cn(
                'bg-white/70 text-primary shadow-sm hover:bg-white',
                chartType === 'line' && 'ring-2 ring-primary/20',
              )}
              onClick={() => setChartType('line')}
              aria-label="Line chart"
            >
              <LineChartIcon className="size-4" strokeWidth={1.7} />
            </Button>
            <Button
              variant="ghost"
              size="iconSm"
              className={cn(
                'bg-white/70 text-primary shadow-sm hover:bg-white',
                chartType === 'bar' && 'ring-2 ring-primary/20',
              )}
              onClick={() => setChartType('bar')}
              aria-label="Bar chart"
            >
              <BarChart3 className="size-4" strokeWidth={1.7} />
            </Button>
            <Button
              variant="ghost"
              size="iconSm"
              className="hidden bg-white/70 text-primary shadow-sm hover:bg-white sm:inline-flex"
              aria-label="Activity chart"
            >
              <Activity className="size-4" strokeWidth={1.7} />
            </Button>
          </div>
        </div>

        <div className="mt-2 min-h-[140px] flex-1 sm:min-h-[120px]">
          <ClientOnly fallback={<div className="h-full min-h-[140px] animate-pulse rounded-xl bg-[var(--jungle-50)]" />}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} barCategoryGap="18%">
                  <XAxis hide />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip content={<BalanceTooltip />} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.label}
                        fill={
                          entry.isActive ? 'url(#jungleBar)' : 'url(#softBar)'
                        }
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="jungleBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--jungle-600)" />
                      <stop offset="100%" stopColor="var(--jungle-300)" />
                    </linearGradient>
                    <linearGradient id="softBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="var(--jungle-100)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <XAxis hide />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip content={<BalanceTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--jungle-600)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </ClientOnly>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setSelectedRange(range)}
              className={cn(
                'rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition',
                selectedRange === range && 'bg-[var(--jungle-900)] text-white',
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
