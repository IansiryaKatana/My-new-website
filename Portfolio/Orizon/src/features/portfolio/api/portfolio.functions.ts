import { createServerFn } from '@tanstack/react-start'
import { formatDistanceToNowStrict } from 'date-fns'
import { z } from 'zod'

import { addAccountSchema } from '@/features/portfolio/schemas/portfolio.schema'
import type {
  BalancePoint,
  ChartRange,
  Holding,
  PortfolioOverview,
  SparkPoint,
  WalletSummary,
} from '@/features/portfolio/types/portfolio.types'
import { createServerSupabaseClient } from '@/lib/supabase'

const rangeSchema = z.enum(['1W', '1M', '3M', '6M', 'YTD', '1Y'])

function mapSparkline(
  rows: Array<{ point_index: number; value: number }> | null,
): SparkPoint[] {
  return (rows ?? [])
    .sort((a, b) => a.point_index - b.point_index)
    .map((row) => ({
      pointIndex: row.point_index,
      value: Number(row.value),
    }))
}

export const getPortfolioOverview = createServerFn({ method: 'GET' })
  .validator((range: ChartRange | undefined) =>
    range ? rangeSchema.parse(range) : '1M',
  )
  .handler(async ({ data: range }): Promise<PortfolioOverview> => {
    const supabase = createServerSupabaseClient()

    const [{ data: summary, error: summaryError }, { data: wallets, error: walletsError }] =
      await Promise.all([
        supabase
          .from('orizon_portfolio_summary')
          .select('total_balance, selected_range')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('orizon_wallets')
          .select('*')
          .order('sort_order', { ascending: true }),
      ])

    if (summaryError) throw new Error(summaryError.message)
    if (walletsError) throw new Error(walletsError.message)

    const walletIds = (wallets ?? []).map((wallet) => wallet.id)

    const [
      { data: walletSparklines, error: walletSparklineError },
      { data: holdings, error: holdingsError },
      { data: balanceHistory, error: balanceHistoryError },
    ] = await Promise.all([
      walletIds.length
        ? supabase
            .from('orizon_wallet_sparkline')
            .select('wallet_id, point_index, value')
            .in('wallet_id', walletIds)
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('orizon_holdings')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase
        .from('orizon_balance_history')
        .select('point_index, label, value, is_active')
        .eq('range_key', range)
        .order('point_index', { ascending: true }),
    ])

    if (walletSparklineError) throw new Error(walletSparklineError.message)
    if (holdingsError) throw new Error(holdingsError.message)
    if (balanceHistoryError) throw new Error(balanceHistoryError.message)

    const holdingIds = (holdings ?? []).map((holding) => holding.id)

    const { data: holdingSparklines, error: holdingSparklineError } =
      holdingIds.length
        ? await supabase
            .from('orizon_holding_sparkline')
            .select('holding_id, point_index, value')
            .in('holding_id', holdingIds)
        : { data: [], error: null }

    if (holdingSparklineError) throw new Error(holdingSparklineError.message)

    const walletSparklineMap = new Map<string, SparkPoint[]>()
    for (const row of walletSparklines ?? []) {
      const current = walletSparklineMap.get(row.wallet_id) ?? []
      current.push({ pointIndex: row.point_index, value: Number(row.value) })
      walletSparklineMap.set(row.wallet_id, current)
    }

    const holdingSparklineMap = new Map<string, SparkPoint[]>()
    for (const row of holdingSparklines ?? []) {
      const current = holdingSparklineMap.get(row.holding_id) ?? []
      current.push({ pointIndex: row.point_index, value: Number(row.value) })
      holdingSparklineMap.set(row.holding_id, current)
    }

    const mappedWallets: WalletSummary[] = (wallets ?? []).map((wallet) => ({
      id: wallet.id,
      provider: wallet.provider,
      label: wallet.label,
      balance: Number(wallet.balance),
      changeAmount: Number(wallet.change_amount),
      changePercent: Number(wallet.change_percent),
      iconKey: wallet.icon_key,
      updatedAt: formatDistanceToNowStrict(new Date(wallet.updated_at), {
        addSuffix: true,
      }),
      sparkline: (walletSparklineMap.get(wallet.id) ?? []).sort(
        (a, b) => a.pointIndex - b.pointIndex,
      ),
    }))

    const mappedHoldings: Holding[] = (holdings ?? []).map((holding) => ({
      id: holding.id,
      symbol: holding.symbol,
      name: holding.name,
      network: holding.network,
      currentValue: Number(holding.current_value),
      changePercent: Number(holding.change_percent),
      iconKey: holding.icon_key,
      iconBg: holding.icon_bg,
      iconColor: holding.icon_color,
      sparkline: (holdingSparklineMap.get(holding.id) ?? []).sort(
        (a, b) => a.pointIndex - b.pointIndex,
      ),
    }))

    const mappedBalanceHistory: BalancePoint[] = (balanceHistory ?? []).map(
      (point) => ({
        pointIndex: point.point_index,
        label: point.label,
        value: Number(point.value),
        isActive: point.is_active,
      }),
    )

    return {
      totalBalance: Number(summary?.total_balance ?? 0),
      selectedRange: range,
      wallets: mappedWallets,
      holdings: mappedHoldings,
      balanceHistory: mappedBalanceHistory,
    }
  })

export const addPortfolioAccount = createServerFn({ method: 'POST' })
  .validator((input: unknown) => addAccountSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from('orizon_wallets').insert({
      provider: data.provider,
      label: data.label,
      balance: 0,
      change_amount: 0,
      change_percent: 0,
      icon_key: data.accountType,
      sort_order: 99,
    })

    if (error) throw new Error(error.message)

    return { success: true }
  })
