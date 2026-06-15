import { createFileRoute } from '@tanstack/react-router'

import { StaybilLanding } from '../components/staybil-landing'

export const Route = createFileRoute('/')({
  component: StaybilLanding,
})
