import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteLogo } from '@/components/landing/SiteLogo'

export const Route = createFileRoute('/locations')({
  component: LocationsPage,
  head: () => ({ meta: [{ title: 'Locations — NGUNJUK' }] }),
})

function LocationsPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] px-6 py-10">
      <Link to="/" className="inline-block">
        <SiteLogo className="text-[var(--deep-green)]" />
      </Link>
      <h1 className="mt-10 text-4xl font-bold">Our Locations</h1>
      <p className="mt-4 max-w-lg text-[var(--text-dark)]/75">
        Café locations coming soon. Manage locations via Supabase when you extend the
        schema.
      </p>
    </div>
  )
}
