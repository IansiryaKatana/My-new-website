import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteLogo } from '@/components/landing/SiteLogo'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({ meta: [{ title: 'Contact — NGUNJUK' }] }),
})

function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] px-6 py-10">
      <Link to="/" className="inline-block">
        <SiteLogo className="text-[var(--deep-green)]" />
      </Link>
      <h1 className="mt-10 text-4xl font-bold">Contact Us</h1>
      <p className="mt-4 max-w-lg text-[var(--text-dark)]/75">
        Reach the NGUNJUK team at hello@ngunjuk.com. Content editable from the admin
        CMS marketing pages module.
      </p>
    </div>
  )
}
