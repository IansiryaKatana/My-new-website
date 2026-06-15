import { createFileRoute, Link } from '@tanstack/react-router'
import { useCms } from '@/contexts/CmsContext'
import { SiteLogo } from '@/components/landing/SiteLogo'
import { CTAButton } from '@/components/landing/CTAButton'

export const Route = createFileRoute('/signature')({
  component: SignaturePage,
  head: () => ({ meta: [{ title: 'Signature — NGUNJUK' }] }),
})

function SignaturePage() {
  const { products } = useCms()
  const signature = products.filter((p) => p.category === 'signature')

  return (
    <div className="min-h-screen bg-[var(--cream)] px-6 py-10">
      <Link to="/" className="inline-block">
        <SiteLogo className="text-[var(--deep-green)]" />
      </Link>
      <h1 className="mt-10 text-4xl font-bold">
        Signature <span className="font-serif-accent">Drinks</span>
      </h1>
      <ul className="mt-8 space-y-4">
        {signature.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--deep-green)]/10 bg-white p-5 sm:flex-row sm:items-center"
          >
            <img
              src={p.image}
              alt=""
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h2 className="font-bold">{p.name}</h2>
              <p className="text-sm opacity-70">{p.shortDescription}</p>
            </div>
            <CTAButton href={p.ctaHref} variant="matcha">
              Order
            </CTAButton>
          </li>
        ))}
      </ul>
    </div>
  )
}
