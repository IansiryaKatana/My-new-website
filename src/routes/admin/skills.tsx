import { createFileRoute } from '@tanstack/react-router'

import { AdminSkills } from '../../admin/AdminSkills'

export const Route = createFileRoute('/admin/skills')({
  component: AdminSkills,
})

