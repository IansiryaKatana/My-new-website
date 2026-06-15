import { createFileRoute } from '@tanstack/react-router'
import { AdminPortfolio } from '#/admin/pages/AdminPortfolio'

export const Route = createFileRoute('/admin/portfolio')({
  component: AdminPortfolio,
})
