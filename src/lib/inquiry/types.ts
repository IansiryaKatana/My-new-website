export type InquiryOpenOptions = {
  source?: string
  sourceRef?: string
  prefillMessage?: string
  title?: string
}

export function isInquiryHref(href: string) {
  const path = href.split('?')[0]?.split('#')[0] ?? href
  return path === '/contact'
}
