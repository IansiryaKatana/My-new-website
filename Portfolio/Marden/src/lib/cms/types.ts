export type FooterLink = { label: string; href: string }

export type CmsNavigationLink = {
  id: string
  label: string
  href: string
  sort_order: number
  is_cta: boolean
}

export type CmsHero = {
  headline_line1: string
  headline_line2: string
  subcopy: string
  cta_label: string
  cta_url: string
  background_image_url: string
  thumbnail_image_url: string
}

export type CmsMetric = {
  id: string
  value: string
  label: string
  sort_order: number
  featured: boolean
}

export type CmsProject = {
  id: string
  title: string
  slug: string
  description: string
  phase?: string
  location?: string
  image_url: string
  category: string
  layout: 'stacked' | 'featured'
  cta_label: string
  cta_url: string
  sort_order: number
}

export type CmsService = {
  id: string
  name: string
  slug: string
  description?: string
  active: boolean
  sort_order: number
}

export type CmsSectionCopy = {
  eyebrow?: string
  heading?: string
  body?: string
  image_url?: string
}

export type CmsProcessStage = {
  id: string
  number: string
  title: string
  description: string
  sort_order: number
}

export type CmsMapLocation = {
  id: string
  country: string
  region?: string
  x_percent: number
  y_percent: number
  status: 'active' | 'inactive'
}

export type CmsFooterColumn = {
  id: string
  title: string
  links: FooterLink[]
  sort_order: number
}

export type CmsSocialLink = {
  id: string
  label: string
  href: string
  sort_order: number
}

export type CmsSnapshot = {
  siteSettings: Record<string, unknown>
  navigation: CmsNavigationLink[]
  hero: CmsHero
  metrics: CmsMetric[]
  projectsSection: CmsSectionCopy
  projects: CmsProject[]
  capabilities: CmsSectionCopy & {
    cta_label: string
    cta_url: string
    background_image_url: string
    services_card_title: string
  }
  services: CmsService[]
  processSection: CmsSectionCopy
  processStages: CmsProcessStage[]
  mapSection: { heading: string; cta_label: string; cta_url: string }
  mapLocations: CmsMapLocation[]
  footerColumns: CmsFooterColumn[]
  socialLinks: CmsSocialLink[]
}
