import { ArrowUpRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { products } from '@/data/wellness'
import { cn } from '@/lib/utils'

const categories = ['All', ...Array.from(new Set(products.map((product) => product.category)))]

export function FormulaSection() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(products[0].id)

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase())

      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const selected = products.find((product) => product.id === selectedId) ?? filtered[0] ?? products[0]

  return (
    <section id="formulas" className="bg-aurora-white py-20 md:py-28">
      <div className="section-reveal page-container">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-xs transition-colors duration-500',
                  category === item ? 'bg-forest text-aurora-white' : 'bg-warm-white text-muted hover:text-forest',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="flex min-w-0 items-center gap-3 rounded-full bg-warm-white px-4 py-3 text-sm text-muted lg:min-w-72">
            <Search className="size-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search formulas"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
              aria-label="Search formulas"
            />
          </label>
        </div>

        <h2 className="mb-12 max-w-4xl text-[clamp(2.4rem,5vw,5rem)] font-light leading-[0.94] tracking-[-0.06em] text-charcoal">
          Daily formulas crafted to support your natural rhythm.
        </h2>

        <div className="grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedId(product.id)}
                  className={cn(
                    'card-hover rounded-[1.5rem] p-5 text-left',
                    selected.id === product.id ? 'bg-forest text-aurora-white' : 'bg-warm-white text-charcoal hover:bg-stone',
                  )}
                >
                  <div className={cn('mb-6 flex h-72 items-end justify-center overflow-hidden rounded-[1.1rem]', product.shade)}>
                    <img src={product.image} alt={product.name} className="image-treatment h-full w-full object-cover mix-blend-screen opacity-90" loading="lazy" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-light tracking-[-0.05em]">{product.name}</p>
                      <p className={cn('mt-1 text-xs', selected.id === product.id ? 'text-aurora-white/62' : 'text-muted')}>{product.category}</p>
                    </div>
                    <span className="rounded-full bg-current/10 px-3 py-1 text-xs">${product.price}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-warm-white p-8 text-sm text-muted sm:col-span-2">
                No formulas match that search. Try another wellness goal.
              </div>
            )}
          </div>

          <aside className="sticky top-6 h-fit rounded-[1.5rem] bg-cream-green p-6 text-deep-green">
            <p className="mb-6 text-xs uppercase tracking-[0.28em] text-deep-green/60">Selected formula</p>
            <h3 className="mb-4 text-4xl font-light tracking-[-0.06em]">{selected.name}</h3>
            <Rating value={selected.rating} count={128} />
            <p className="mt-6 text-sm leading-6 text-deep-green/72">{selected.description}</p>
            <div className="my-8 grid gap-2">
              {selected.benefits.map((benefit) => (
                <span key={benefit} className="rounded-full bg-aurora-white/70 px-4 py-2 text-sm">
                  {benefit}
                </span>
              ))}
            </div>
            <Button asChild variant="primary" className="w-full">
              <a href="#consult">
                Add to care plan
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </aside>
        </div>
      </div>
    </section>
  )
}
