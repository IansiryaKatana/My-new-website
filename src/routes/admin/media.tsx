import { createFileRoute } from '@tanstack/react-router'

import { AdminMedia } from '../../admin/AdminMedia'

export const Route = createFileRoute('/admin/media')({
  component: AdminMedia,
})

