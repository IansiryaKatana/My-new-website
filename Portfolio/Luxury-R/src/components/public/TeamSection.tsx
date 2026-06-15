import { useCms } from '@/contexts/CmsContext'
import { Button } from '@/components/ui/button'

export function TeamSection() {
  const { data } = useCms()

  return (
    <section id="team" className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
        <div>
          <h2 className="section-heading">
            We are a team
            <span className="block">of experts</span>
            <span className="font-serif-accent block normal-case text-base">
              working for you
            </span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Refined guidance from advisors who understand luxury coastal
            markets, legal verification, and discreet negotiation.
          </p>
          <Button className="mt-8 hidden lg:inline-flex">Send message</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.team.map((member, i) => (
            <article
              key={member.id}
              className={`relative overflow-hidden ${i === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <h3 className="text-lg text-white">{member.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/75">
                  {member.role}
                </p>
                {i === 1 && (
                  <ul className="mt-3 space-y-1 text-xs text-white/85">
                    {member.stats.map((s) => (
                      <li key={s}>• {s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <Button className="lg:hidden">Send message</Button>
      </div>
    </section>
  )
}
