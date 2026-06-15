import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/components/landing/LandingPage'

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        title: 'NGUNJUK — Matcha On Perfect',
      },
      {
        name: 'description',
        content:
          'Premium ceremonial matcha. Clean energy, no crash. Order NGUNJUK matcha drinks online.',
      },
    ],
  }),
})
