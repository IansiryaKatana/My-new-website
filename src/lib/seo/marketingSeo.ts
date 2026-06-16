import type { MarketingPageView } from '../cms/types'

type SeoMeta = {
  title?: string
  description?: string
  canonicalPath?: string
  noindex?: boolean
}

export type SeoLinkItem = {
  label: string
  href: string
  note?: string
}

function asObject(value: unknown) {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null
}

export function getMarketingSeoMeta(page: MarketingPageView | null): SeoMeta {
  const meta = asObject(page?.meta)
  if (!meta) return {}

  return {
    title: typeof meta.seoTitle === 'string' ? meta.seoTitle.trim() : undefined,
    description:
      typeof meta.seoDescription === 'string'
        ? meta.seoDescription.trim()
        : undefined,
    canonicalPath:
      typeof meta.canonicalPath === 'string' ? meta.canonicalPath.trim() : undefined,
    noindex: meta.noindex === true,
  }
}

export function getMarketingFaq(
  page: MarketingPageView | null,
): Array<{ question: string; answer: string }> {
  const sections = asObject(page?.sections)
  if (!sections || !Array.isArray(sections.faq)) return []
  return sections.faq
    .filter(
      (
        item,
      ): item is { question: string; answer: string } =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as { question?: unknown }).question === 'string' &&
        typeof (item as { answer?: unknown }).answer === 'string',
    )
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question.length > 0 && item.answer.length > 0)
}

export function getMarketingInternalLinks(page: MarketingPageView | null): SeoLinkItem[] {
  if (!page) return []
  return page.internalLinks.filter(
    (item) => item.label.trim().length > 0 && item.href.trim().length > 0,
  )
}
