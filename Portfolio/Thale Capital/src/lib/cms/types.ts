import { publicAsset } from '../../../../../demo-assets'

export type Pillar = {
  id: string
  title: string
  description: string
  sort_order: number
  is_highlighted: boolean
}

export type Investment = {
  id: string
  title: string
  industry: string
  year: string
  description: string
  image_url: string
  is_featured: boolean
}

export type SiteSetting = {
  key: string
  value: string
}

export type ContactLead = {
  full_name: string
  email: string
  phone: string
  message: string
  accepted_terms: boolean
  source_page: string
}

export type CmsSnapshot = {
  mode: 'static' | 'live'
  siteSettings: SiteSetting[]
  pillars: Pillar[]
  investments: Investment[]
}

export const fallbackSnapshot: CmsSnapshot = {
  mode: 'static',
  siteSettings: [
    { key: 'brand_name', value: 'Thale Capital' },
    { key: 'hero_heading', value: 'Northbridge Infrastructure Partners' },
    {
      key: 'hero_subtitle',
      value:
        'Owner and operator of essential transport and energy infrastructure assets across North America.',
    },
    {
      key: 'overview_copy',
      value:
        'Northbridge Infrastructure Partners is an owner and operator of essential transport and energy infrastructure assets across North America.',
    },
    {
      key: 'thesis_copy',
      value:
        'The company’s diversified asset base, stable cash flow profile, and experienced management team align with a disciplined long-term capital strategy.',
    },
  ],
  pillars: [
    {
      id: '1',
      title: 'Operational Excellence',
      description: 'Operational efficiency programs improve asset cash returns.',
      sort_order: 1,
      is_highlighted: false,
    },
    {
      id: '2',
      title: 'Capital Optimization',
      description: 'Refinancing capital structure to extend debt maturity profile.',
      sort_order: 2,
      is_highlighted: true,
    },
    {
      id: '3',
      title: 'Strategic Growth',
      description:
        'Selective acquisition of complementary regional infrastructure platforms.',
      sort_order: 3,
      is_highlighted: false,
    },
  ],
  investments: [
    {
      id: '1',
      title: 'Velox Industrial Group',
      industry: 'Infrastructure',
      year: '2021',
      description:
        'A platform acquisition supporting disciplined expansion across transport and logistics corridors.',
      image_url: publicAsset('hero-reference.webp'),
      is_featured: true,
    },
  ],
}

export function setting(
  settings: SiteSetting[],
  key: string,
  fallback = '',
): string {
  return settings.find((x) => x.key === key)?.value ?? fallback
}
