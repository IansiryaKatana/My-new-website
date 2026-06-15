import { createFileRoute } from '@tanstack/react-router'

import { PortfolioPage } from '@/features/portfolio/components/PortfolioPage'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})
