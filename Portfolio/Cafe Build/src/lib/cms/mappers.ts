import type { Json, Tables } from '#/integrations/supabase/database.types'
import type {
  Benefit,
  CmsSnapshot,
  EssenceSection,
  FlavorFruitCard,
  FlavorSection,
  FooterSection,
  HeroSection,
  NavItem,
  Product,
  ProductCategory,
  PromoSection,
  SiteBrand,
} from '#/lib/cms/types'
import fallbackSnapshot from '#/data/cms-fallback.json'

type ProductRow = Tables<'products'>
type BenefitRow = Tables<'benefits'>
type NavItemRow = Tables<'nav_items'>
type ContentSectionRow = Tables<'content_sections'>
type SiteSettingRow = Tables<'site_settings'>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(
  payload: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = payload[key]
  return typeof value === 'string' ? value : fallback
}

function readBoolean(
  payload: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const value = payload[key]
  return typeof value === 'boolean' ? value : fallback
}

function readStringArray(
  payload: Record<string, unknown>,
  key: string,
  fallback: string[],
): string[] {
  const value = payload[key]
  if (!Array.isArray(value)) return fallback
  return value.filter((item): item is string => typeof item === 'string')
}

function readFruitCards(
  payload: Record<string, unknown>,
  fallback: FlavorFruitCard[],
): FlavorFruitCard[] {
  const value = payload.fruitCards
  if (!Array.isArray(value)) return fallback

  return value.flatMap((item) => {
    if (!isRecord(item)) return []
    const name = item.name
    const imageUrl = item.imageUrl
    if (typeof name !== 'string' || typeof imageUrl !== 'string') return []
    return [{ name, imageUrl }]
  })
}

function parsePayload(payload: Json): Record<string, unknown> {
  return isRecord(payload) ? payload : {}
}

function toProductCategory(value: string): ProductCategory {
  if (value === 'ceremonial' || value === 'seasonal' || value === 'signature') {
    return value
  }
  return 'signature'
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    descriptionHtml: row.description_html,
    imageUrl: row.image_url,
    price: row.price,
    category: toProductCategory(row.category),
    flavor: row.flavor,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    ctaHref: row.cta_href,
  }
}

export function mapBenefit(row: BenefitRow): Benefit {
  return {
    id: row.id,
    label: row.label,
    sortOrder: row.sort_order,
  }
}

export function mapNavItem(row: NavItemRow): NavItem {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    isHighlighted: row.is_highlighted,
    sortOrder: row.sort_order,
  }
}

export function mapSiteBrand(rows: SiteSettingRow[]): SiteBrand {
  const brandRow = rows.find((row) => row.key === 'brand')
  const payload = parsePayload(brandRow?.value ?? null)

  return {
    name: readString(payload, 'name', fallbackSnapshot.brand.name),
    tagline: readString(payload, 'tagline', fallbackSnapshot.brand.tagline),
    primaryColor: readString(
      payload,
      'primaryColor',
      fallbackSnapshot.brand.primaryColor,
    ),
    limeColor: readString(payload, 'limeColor', fallbackSnapshot.brand.limeColor),
    creamColor: readString(
      payload,
      'creamColor',
      fallbackSnapshot.brand.creamColor,
    ),
  }
}

export function mapHeroSection(payload: Json): HeroSection {
  const data = parsePayload(payload)
  const fallback = fallbackSnapshot.hero

  return {
    headlineMain: readString(data, 'headlineMain', fallback.headlineMain),
    headlineSub: readString(data, 'headlineSub', fallback.headlineSub),
    bgImageUrl: readString(data, 'bgImageUrl', fallback.bgImageUrl),
    ctaText: readString(data, 'ctaText', fallback.ctaText),
    ctaHref: readString(data, 'ctaHref', fallback.ctaHref),
    badgeText: readString(data, 'badgeText', fallback.badgeText),
    microCardTitle: readString(data, 'microCardTitle', fallback.microCardTitle),
    microCardDescription: readString(
      data,
      'microCardDescription',
      fallback.microCardDescription,
    ),
    showFrame: readBoolean(data, 'showFrame', fallback.showFrame),
  }
}

export function mapEssenceSection(payload: Json): EssenceSection {
  const data = parsePayload(payload)
  const fallback = fallbackSnapshot.essence

  return {
    headingMain: readString(data, 'headingMain', fallback.headingMain),
    headingAccent: readString(data, 'headingAccent', fallback.headingAccent),
    subheading: readString(data, 'subheading', fallback.subheading),
    imageUrl: readString(data, 'imageUrl', fallback.imageUrl),
    captionLeft: readString(data, 'captionLeft', fallback.captionLeft),
    captionRight: readString(data, 'captionRight', fallback.captionRight),
  }
}

export function mapPromoSection(payload: Json): PromoSection {
  const data = parsePayload(payload)
  const fallback = fallbackSnapshot.promo

  return {
    leftTitle: readString(data, 'leftTitle', fallback.leftTitle),
    leftAccent: readString(data, 'leftAccent', fallback.leftAccent),
    productImageUrl: readString(data, 'productImageUrl', fallback.productImageUrl),
    lifestyleImageUrl: readString(
      data,
      'lifestyleImageUrl',
      fallback.lifestyleImageUrl,
    ),
    ctaText: readString(data, 'ctaText', fallback.ctaText),
    ctaHref: readString(data, 'ctaHref', fallback.ctaHref),
    supportLines: readStringArray(data, 'supportLines', fallback.supportLines),
    marqueeWords: readStringArray(data, 'marqueeWords', fallback.marqueeWords),
  }
}

export function mapFlavorSection(payload: Json): FlavorSection {
  const data = parsePayload(payload)
  const fallback = fallbackSnapshot.flavor

  return {
    headingMain: readString(data, 'headingMain', fallback.headingMain),
    headingAccent: readString(data, 'headingAccent', fallback.headingAccent),
    productImageUrl: readString(data, 'productImageUrl', fallback.productImageUrl),
    productLabel: readString(data, 'productLabel', fallback.productLabel),
    ctaText: readString(data, 'ctaText', fallback.ctaText),
    ctaHref: readString(data, 'ctaHref', fallback.ctaHref),
    labelLeft: readString(data, 'labelLeft', fallback.labelLeft),
    labelRight: readString(data, 'labelRight', fallback.labelRight),
    fruitCards: readFruitCards(data, fallback.fruitCards),
  }
}

export function mapFooterSection(payload: Json): FooterSection {
  const data = parsePayload(payload)
  const fallback = fallbackSnapshot.footer

  return {
    newsletterTitle: readString(
      data,
      'newsletterTitle',
      fallback.newsletterTitle,
    ),
    newsletterPlaceholder: readString(
      data,
      'newsletterPlaceholder',
      fallback.newsletterPlaceholder,
    ),
    wordmark: readString(data, 'wordmark', fallback.wordmark),
    copyright: readString(data, 'copyright', fallback.copyright),
  }
}

function sectionPayloadByKey(
  rows: ContentSectionRow[],
  sectionKey: string,
): Json {
  return rows.find((row) => row.section_key === sectionKey)?.payload ?? {}
}

export function buildProductsBySlug(products: Product[]): Record<string, Product> {
  return Object.fromEntries(products.map((product) => [product.slug, product]))
}

export function mapCmsSnapshot(input: {
  siteSettings: SiteSettingRow[]
  products: ProductRow[]
  benefits: BenefitRow[]
  navItems: NavItemRow[]
  contentSections: ContentSectionRow[]
}): CmsSnapshot {
  const products = input.products.map(mapProduct)

  return {
    brand: mapSiteBrand(input.siteSettings),
    hero: mapHeroSection(sectionPayloadByKey(input.contentSections, 'hero')),
    essence: mapEssenceSection(sectionPayloadByKey(input.contentSections, 'essence')),
    promo: mapPromoSection(sectionPayloadByKey(input.contentSections, 'promo')),
    flavor: mapFlavorSection(sectionPayloadByKey(input.contentSections, 'flavor')),
    footer: mapFooterSection(sectionPayloadByKey(input.contentSections, 'footer')),
    products,
    benefits: input.benefits.map(mapBenefit),
    navItems: input.navItems.map(mapNavItem),
    productsBySlug: buildProductsBySlug(products),
  }
}

export function getStaticCmsSnapshot(): CmsSnapshot {
  return fallbackSnapshot as CmsSnapshot
}
