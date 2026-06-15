import type { Database } from '@/integrations/supabase/database.types'
import type {
  CmsSnapshot,
  FaqItem,
  HeroStat,
  MarketingBlock,
  ProcessStep,
  Property,
  PropertyCategory,
  SiteSettings,
  Testimonial,
  TeamMember,
} from './types'
import fallback from '@/data/cms-fallback.json'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type TestimonialRow = Database['public']['Tables']['testimonials']['Row']
type TeamRow = Database['public']['Tables']['team_members']['Row']
type FaqRow = Database['public']['Tables']['faq_entries']['Row']
type ProcessRow = Database['public']['Tables']['process_steps']['Row']
type HeroStatRow = Database['public']['Tables']['hero_stats']['Row']
type MarketingRow = Database['public']['Tables']['marketing_blocks']['Row']
type CategoryRow = Database['public']['Tables']['property_categories']['Row']

function parseSetting<T>(value: unknown, fallbackValue: T): T {
  if (value === null || value === undefined) return fallbackValue
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }
  return value as T
}

export function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    description: row.description,
    priceFrom: Number(row.price_from),
    image: row.image_url,
    category: row.category as PropertyCategory,
    status: row.status ?? undefined,
    features: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      area: row.area_label,
      year: row.year_label ?? undefined,
    },
  }
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.client_name,
    location: row.client_location,
    title: row.title,
    quote: row.quote,
    avatar: row.avatar_url ?? '',
    propertyImage: row.property_image_url ?? undefined,
    assignedAgent: row.assigned_agent ?? undefined,
    cardType: row.card_type as 'text' | 'image',
  }
}

export function mapTeam(row: TeamRow): TeamMember {
  const bullets = Array.isArray(row.bullets)
    ? (row.bullets as string[])
    : []
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    image: row.image_url,
    bio: row.bio,
    stats: bullets,
  }
}

export function mapFaq(row: FaqRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
  }
}

export function mapProcess(row: ProcessRow): ProcessStep {
  return {
    id: row.id,
    stepNumber: row.step_number,
    title: row.title,
    description: row.description,
    image: row.image_url ?? undefined,
  }
}

export function mapHeroStat(row: HeroStatRow): HeroStat {
  return { id: row.id, label: row.label, value: row.value }
}

export function mapMarketing(row: MarketingRow): MarketingBlock {
  return {
    key: row.key,
    title: row.title ?? undefined,
    body: row.body ?? undefined,
    ctaLabel: row.cta_label ?? undefined,
    ctaHref: row.cta_href ?? undefined,
    imageUrl: row.image_url ?? undefined,
  }
}

export function buildSiteSettings(
  rows: { key: string; value: unknown }[],
): SiteSettings {
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  const fb = fallback.siteSettings
  return {
    brandName: parseSetting(map.brand_name, fb.brandName),
    heroHeadline: parseSetting(map.hero_headline, fb.heroHeadline),
    heroSubheadline: parseSetting(map.hero_subheadline, fb.heroSubheadline),
    heroTrustCopy: parseSetting(map.hero_trust_copy, fb.heroTrustCopy),
    contactPhone: parseSetting(map.contact_phone, fb.contactPhone),
    contactAvailability: parseSetting(
      map.contact_availability,
      fb.contactAvailability,
    ),
    heroImage: parseSetting(map.hero_image, fb.heroImage),
    faqImage: parseSetting(map.faq_image, fb.faqImage),
    ctaImage: parseSetting(map.cta_image, fb.ctaImage),
  }
}

export function getStaticSnapshot(): CmsSnapshot {
  const blocks = Object.fromEntries(
    Object.entries(fallback.marketingBlocks).map(([k, v]) => {
      const block = v as MarketingBlock & { key: string }
      return [
        k,
        {
          key: block.key,
          title: 'title' in block ? block.title : undefined,
          body: block.body,
          ctaLabel: 'ctaLabel' in block ? block.ctaLabel : undefined,
          ctaHref: 'ctaHref' in block ? block.ctaHref : undefined,
          imageUrl: 'imageUrl' in block ? block.imageUrl : undefined,
        },
      ]
    }),
  )
  return {
    properties: fallback.properties as Property[],
    testimonials: fallback.testimonials as Testimonial[],
    team: fallback.team as TeamMember[],
    faqs: fallback.faqs as FaqItem[],
    processSteps: fallback.processSteps as ProcessStep[],
    heroStats: fallback.heroStats as HeroStat[],
    marketingBlocks: blocks,
    siteSettings: fallback.siteSettings as SiteSettings,
    categories: fallback.categories as { slug: PropertyCategory; label: string }[],
  }
}

export function mapCategories(rows: CategoryRow[]) {
  return rows.map((r) => ({
    slug: r.slug as PropertyCategory,
    label: r.label,
  }))
}
