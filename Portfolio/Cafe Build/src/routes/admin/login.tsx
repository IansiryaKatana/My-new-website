import { createFileRoute } from '@tanstack/react-router'
import { AdminLogin } from '#/admin/AdminLogin'

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
  validateSearch: (search: Record<string, unknown>) => ({
    from: typeof search.from === 'string' ? search.from : undefined,
  }),
})
