import { createFileRoute } from '@tanstack/react-router'
import type {} from '@tanstack/react-start'

import { serveDemoAsset } from '../../../lib/serveDemoAsset'

export const Route = createFileRoute('/demos/$slug/')({
  server: {
    handlers: {
      GET: async ({ params }) => serveDemoAsset(params.slug, 'index.html'),
    },
  },
})
