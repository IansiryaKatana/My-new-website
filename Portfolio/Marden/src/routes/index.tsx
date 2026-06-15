import { createFileRoute } from '@tanstack/react-router'
import { MardenHomePage } from '#/components/site/MardenHomePage'

export const Route = createFileRoute('/')({
  component: MardenHomePage,
})
