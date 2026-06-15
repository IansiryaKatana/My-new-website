import { useCms } from '../../contexts/CmsContext'

export function useMarketingPage(slug: string) {
  const { snapshot } = useCms()
  return snapshot.marketingPages[slug] ?? null
}

export function getMarketingSection<T>(
  page: ReturnType<typeof useMarketingPage>,
  key: string,
  fallback: T,
): T {
  if (!page?.sections) return fallback
  const value = page.sections[key]
  return (value as T) ?? fallback
}

