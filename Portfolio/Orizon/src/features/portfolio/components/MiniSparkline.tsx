import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts'

import { ClientOnly } from '@/components/ClientOnly'
import type { SparkPoint } from '@/features/portfolio/types/portfolio.types'

type MiniSparklineProps = {
  data: SparkPoint[]
  stroke?: string
  fill?: string
  height?: number
}

function MiniTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-primary shadow">
      {payload[0]?.value.toFixed(2)}
    </div>
  )
}

export function MiniSparkline({
  data,
  stroke = 'rgba(255,255,255,0.9)',
  fill = 'rgba(255,255,255,0.12)',
  height = 72,
}: MiniSparklineProps) {
  const chartData = data.map((point) => ({
    value: point.value,
    index: point.pointIndex,
  }))

  return (
    <ClientOnly fallback={<div className="h-[72px] w-full" style={{ height }} />}>
      <div className="h-[72px] w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip content={<MiniTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={stroke}
              fill={fill}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: '#f6d365', stroke: '#fff', strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  )
}
