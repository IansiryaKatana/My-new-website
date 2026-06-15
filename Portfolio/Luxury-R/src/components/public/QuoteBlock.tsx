import { useCms } from '@/contexts/CmsContext'
import { Button } from '@/components/ui/button'

export function QuoteBlock() {
  const block = useCms().data.marketingBlocks.quote_pause

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
      <div className="mx-auto mb-8 h-px w-16 bg-line" />
      <p className="text-sm leading-relaxed text-muted">{block?.title}</p>
      <p className="mt-2 text-sm text-olive-dark">{block?.body}</p>
      <Button className="mt-10" asChild>
        <a href={block?.ctaHref ?? '#contact'}>{block?.ctaLabel ?? 'Get in touch'}</a>
      </Button>
    </section>
  )
}
