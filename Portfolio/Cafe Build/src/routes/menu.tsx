import { createFileRoute, Link } from '@tanstack/react-router'
import { useCms } from '@/contexts/CmsContext'
import { CTAButton } from '@/components/landing/CTAButton'
import { SiteLogo } from '@/components/landing/SiteLogo'

export const Route = createFileRoute('/menu')({
  component: MenuPage,
  head: () => ({ meta: [{ title: 'Our Menu — NGUNJUK' }] }),
})

function MenuPage() {
  const { products, loading } = useCms()

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--text-dark)]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/">
          <SiteLogo className="text-[var(--deep-green)]" />
        </Link>
        <CTAButton href="/" variant="matcha">
          Back Home
        </CTAButton>
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our <span className="font-serif-accent">Menu</span>
        </h1>
        <p className="mt-3 max-w-xl text-[var(--deep-green)]/80">
          Ceremonial-grade matcha drinks crafted for clean energy.
        </p>
        {loading ? (
          <p className="mt-10 text-sm opacity-60">Loading menu…</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-[var(--deep-green)]/10 bg-white shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--matcha)]">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{product.name}</h2>
                  <p className="mt-2 text-sm text-[var(--text-dark)]/70">
                    {product.shortDescription}
                  </p>
                  <div className="mt-4">
                    <CTAButton href={product.ctaHref} variant="matcha">
                      Order Now
                    </CTAButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
