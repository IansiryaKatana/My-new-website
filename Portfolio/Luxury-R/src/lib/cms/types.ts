export type PropertyCategory = 'loft' | 'budget' | 'rent'

export type Property = {
  id: string
  slug: string
  title: string
  location: string
  description: string
  priceFrom: number
  image: string
  category: PropertyCategory
  status?: string
  features: {
    bedrooms: number
    bathrooms: number
    area: string
    year?: string
  }
}

export type Testimonial = {
  id: string
  name: string
  location: string
  title: string
  quote: string
  avatar: string
  propertyImage?: string
  assignedAgent?: string
  cardType: 'text' | 'image'
}

export type TeamMember = {
  id: string
  name: string
  role: string
  image: string
  bio: string
  stats: string[]
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type ProcessStep = {
  id: string
  stepNumber: string
  title: string
  description: string
  image?: string
}

export type HeroStat = {
  id: string
  label: string
  value: string
}

export type MarketingBlock = {
  key: string
  title?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imageUrl?: string
}

export type SiteSettings = {
  brandName: string
  heroHeadline: string
  heroSubheadline: string
  heroTrustCopy: string
  contactPhone: string
  contactAvailability: string
  heroImage: string
  faqImage: string
  ctaImage: string
}

export type CmsSnapshot = {
  properties: Property[]
  testimonials: Testimonial[]
  team: TeamMember[]
  faqs: FaqItem[]
  processSteps: ProcessStep[]
  heroStats: HeroStat[]
  marketingBlocks: Record<string, MarketingBlock>
  siteSettings: SiteSettings
  categories: { slug: PropertyCategory; label: string }[]
}
