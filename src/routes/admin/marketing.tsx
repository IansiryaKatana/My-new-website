import { createFileRoute } from '@tanstack/react-router'

import { AdminMarketing } from '../../admin/AdminMarketing'

export const Route = createFileRoute('/admin/marketing')({
  component: AdminMarketing,
})

