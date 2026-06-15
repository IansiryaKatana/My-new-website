import { createFileRoute } from '@tanstack/react-router'

import { PosDashboard } from '#/components/pos-dashboard'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <PosDashboard />
}
