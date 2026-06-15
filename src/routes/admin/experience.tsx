import { createFileRoute } from '@tanstack/react-router'

import { AdminExperience } from '../../admin/AdminExperience'

export const Route = createFileRoute('/admin/experience')({
  component: AdminExperience,
})

