export type ProductCategory = 'ceremonial' | 'seasonal' | 'signature'

export interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string
  descriptionHtml: string
  imageUrl: string
  price: number | null
  category: ProductCategory
  flavor: string | null
  isFeatured: boolean
  sortOrder: number
  ctaHref: string
}

export interface Benefit {
  id: string
  label: string
  sortOrder: number
}

export interface NavItem {
  id: string
  label: string
  href: string
  isHighlighted: boolean
  sortOrder: number
}

export interface HeroSection {
  headlineMain: string
  headlineSub: string
  bgImageUrl: string
  ctaText: string
  ctaHref: string
  badgeText: string
  microCardTitle: string
  microCardDescription: string
  showFrame: boolean
}

export interface EssenceSection {
  headingMain: string
  headingAccent: string
  subheading: string
  imageUrl: string
  captionLeft: string
  captionRight: string
}

export interface PromoSection {
  leftTitle: string
  leftAccent: string
  productImageUrl: string
  lifestyleImageUrl: string
  ctaText: string
  ctaHref: string
  supportLines: string[]
  marqueeWords: string[]
}

export interface FlavorFruitCard {
  name: string
  imageUrl: string
}

export interface FlavorSection {
  headingMain: string
  headingAccent: string
  productImageUrl: string
  productLabel: string
  ctaText: string
  ctaHref: string
  labelLeft: string
  labelRight: string
  fruitCards: FlavorFruitCard[]
}

export interface FooterSection {
  newsletterTitle: string
  newsletterPlaceholder: string
  wordmark: string
  copyright: string
}

export interface SiteBrand {
  name: string
  tagline: string
  primaryColor: string
  limeColor: string
  creamColor: string
}

export interface CmsSnapshot {
  brand: SiteBrand
  hero: HeroSection
  essence: EssenceSection
  promo: PromoSection
  flavor: FlavorSection
  footer: FooterSection
  products: Product[]
  benefits: Benefit[]
  navItems: NavItem[]
  productsBySlug: Record<string, Product>
}

export type CmsMode = 'static' | 'live'

export type HeroSectionPayload = HeroSection
export type EssenceSectionPayload = EssenceSection
export type PromoSectionPayload = PromoSection
export type FlavorSectionPayload = FlavorSection
export type FooterSectionPayload = FooterSection

export interface CmsSections {
  hero: HeroSection
  essence: EssenceSection
  promo: PromoSection
  flavor: FlavorSection
  footer: FooterSection
}
