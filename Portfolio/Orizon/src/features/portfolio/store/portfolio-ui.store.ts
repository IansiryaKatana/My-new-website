import { create } from 'zustand'

import type { ChartRange, PortfolioTab } from '@/features/portfolio/types/portfolio.types'

type PortfolioUiState = {
  activeTab: PortfolioTab
  selectedRange: ChartRange
  addSheetOpen: boolean
  chartType: 'bar' | 'line'
  setActiveTab: (tab: PortfolioTab) => void
  setSelectedRange: (range: ChartRange) => void
  setAddSheetOpen: (open: boolean) => void
  setChartType: (type: 'bar' | 'line') => void
}

export const usePortfolioUiStore = create<PortfolioUiState>((set) => ({
  activeTab: 'overview',
  selectedRange: '1M',
  addSheetOpen: false,
  chartType: 'bar',
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedRange: (range) => set({ selectedRange: range }),
  setAddSheetOpen: (open) => set({ addSheetOpen: open }),
  setChartType: (type) => set({ chartType: type }),
}))
