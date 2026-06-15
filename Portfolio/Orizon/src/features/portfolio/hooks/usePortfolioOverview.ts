import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { getPortfolioOverview } from '@/features/portfolio/api/portfolio.functions'
import type { ChartRange } from '@/features/portfolio/types/portfolio.types'

export function usePortfolioOverview(range: ChartRange) {
  const getOverview = useServerFn(getPortfolioOverview)

  return useQuery({
    queryKey: ['portfolio', 'overview', range],
    queryFn: () => getOverview({ data: range }),
    staleTime: 30_000,
  })
}
