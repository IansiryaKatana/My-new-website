import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/portfolio/$slug', params: { slug: params.slug } })
  },
})
