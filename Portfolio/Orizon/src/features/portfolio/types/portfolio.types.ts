export type ChartRange = '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y'

export type PortfolioTab = 'overview' | 'holding'

export type SparkPoint = {
  pointIndex: number
  value: number
}

export type WalletSummary = {
  id: string
  provider: string
  label: string
  balance: number
  changeAmount: number
  changePercent: number
  iconKey: string
  updatedAt: string
  sparkline: SparkPoint[]
}

export type Holding = {
  id: string
  symbol: string
  name: string
  network: string | null
  currentValue: number
  changePercent: number
  iconKey: string
  iconBg: string
  iconColor: string
  sparkline: SparkPoint[]
}

export type BalancePoint = {
  pointIndex: number
  label: string | null
  value: number
  isActive: boolean
}

export type PortfolioOverview = {
  totalBalance: number
  selectedRange: ChartRange
  wallets: WalletSummary[]
  holdings: Holding[]
  balanceHistory: BalancePoint[]
}

export type AddAccountInput = {
  accountType: 'wallet' | 'exchange' | 'manual_asset' | 'bank'
  provider: string
  label: string
  publicAddress?: string
}
