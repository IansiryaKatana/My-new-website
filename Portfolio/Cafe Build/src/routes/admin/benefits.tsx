import { createFileRoute } from '@tanstack/react-router'
import { AdminBenefits } from '#/admin/AdminBenefits'

export const Route = createFileRoute('/admin/benefits')({
  component: AdminBenefits,
})
