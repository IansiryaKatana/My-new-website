import { createFileRoute } from '@tanstack/react-router'
import { AdminPrinciples } from '#/admin/pages/AdminPrinciples'

export const Route = createFileRoute('/admin/principles')({
  component: AdminPrinciples,
})
