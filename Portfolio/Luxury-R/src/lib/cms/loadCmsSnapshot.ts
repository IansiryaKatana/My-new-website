import { getSupabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/database.types'
import {
  buildSiteSettings,
  getStaticSnapshot,
  mapCategories,
  mapFaq,
  mapHeroStat,
  mapMarketing,
  mapProcess,
  mapProperty,
  mapTestimonial,
  mapTeam,
} from './mappers'
import type { CmsSnapshot } from './types'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type TestimonialRow = Database['public']['Tables']['testimonials']['Row']
type TeamRow = Database['public']['Tables']['team_members']['Row']
type FaqRow = Database['public']['Tables']['faq_entries']['Row']
type ProcessRow = Database['public']['Tables']['process_steps']['Row']
type HeroStatRow = Database['public']['Tables']['hero_stats']['Row']
type MarketingRow = Database['public']['Tables']['marketing_blocks']['Row']
type CategoryRow = Database['public']['Tables']['property_categories']['Row']

type RpcPayload = {
  properties?: PropertyRow[]
  testimonials?: TestimonialRow[]
  team_members?: TeamRow[]
  faq_entries?: FaqRow[]
  process_steps?: ProcessRow[]
  hero_stats?: HeroStatRow[]
  marketing_blocks?: MarketingRow[]
  site_settings?: { key: string; value: unknown }[]
  property_categories?: CategoryRow[]
}

function buildSnapshotFromRpc(payload: RpcPayload, useStaticFill: boolean): CmsSnapshot {
  const staticFallback = getStaticSnapshot()
  const settingsRows = payload.site_settings ?? []
  const siteSettings = buildSiteSettings(settingsRows)

  const marketingBlocks = Object.fromEntries(
    (payload.marketing_blocks ?? []).map((r) => [r.key, mapMarketing(r)]),
  )
  if (useStaticFill) {
    for (const [k, v] of Object.entries(staticFallback.marketingBlocks)) {
      if (!marketingBlocks[k]) marketingBlocks[k] = v
    }
  }

  const pick = <T>(live: T[], fallback: T[]) =>
    live.length > 0 ? live : useStaticFill ? fallback : live

  return {
    properties: (payload.properties ?? []).map(mapProperty),
    testimonials: (payload.testimonials ?? []).map(mapTestimonial),
    team: pick(
      (payload.team_members ?? []).map(mapTeam),
      staticFallback.team,
    ),
    faqs: pick((payload.faq_entries ?? []).map(mapFaq), staticFallback.faqs),
    processSteps: pick(
      (payload.process_steps ?? []).map(mapProcess),
      staticFallback.processSteps,
    ),
    heroStats: pick(
      (payload.hero_stats ?? []).map(mapHeroStat),
      staticFallback.heroStats,
    ),
    marketingBlocks,
    siteSettings,
    categories: pick(
      mapCategories(payload.property_categories ?? []),
      staticFallback.categories,
    ),
  }
}

async function loadViaRpc(
  sb: NonNullable<ReturnType<typeof getSupabase>>,
  useStaticFill: boolean,
) {
  const { data, error } = await sb.rpc('get_public_cms_snapshot')
  if (error) return null
  return buildSnapshotFromRpc((data ?? {}) as RpcPayload, useStaticFill)
}

async function loadViaQueries(
  sb: NonNullable<ReturnType<typeof getSupabase>>,
  useStaticFill: boolean,
) {
  const [
    propertiesRes,
    testimonialsRes,
    teamRes,
    faqsRes,
    processRes,
    heroStatsRes,
    marketingRes,
    settingsRes,
    categoriesRes,
  ] = await Promise.all([
    sb.from('properties').select('*').eq('published', true).order('sort_order'),
    sb.from('testimonials').select('*').eq('published', true).order('sort_order'),
    sb.from('team_members').select('*').eq('published', true).order('sort_order'),
    sb.from('faq_entries').select('*').eq('published', true).order('sort_order'),
    sb.from('process_steps').select('*').eq('published', true).order('sort_order'),
    sb.from('hero_stats').select('*').eq('published', true).order('sort_order'),
    sb.from('marketing_blocks').select('*').eq('published', true),
    sb.from('site_settings').select('key, value'),
    sb.from('property_categories').select('*').eq('active', true).order('sort_order'),
  ])

  return buildSnapshotFromRpc(
    {
      properties: propertiesRes.data ?? [],
      testimonials: testimonialsRes.data ?? [],
      team_members: teamRes.data ?? [],
      faq_entries: faqsRes.data ?? [],
      process_steps: processRes.data ?? [],
      hero_stats: heroStatsRes.data ?? [],
      marketing_blocks: marketingRes.data ?? [],
      site_settings: settingsRes.data ?? [],
      property_categories: categoriesRes.data ?? [],
    },
    useStaticFill,
  )
}

export async function loadCmsSnapshot(): Promise<{
  snapshot: CmsSnapshot
  mode: 'static' | 'live'
  cmsEmpty: boolean
}> {
  const sb = getSupabase()
  if (!sb) {
    return { snapshot: getStaticSnapshot(), mode: 'static', cmsEmpty: false }
  }

  let snapshot = await loadViaRpc(sb, false)
  if (!snapshot) {
    snapshot = await loadViaQueries(sb, false)
  }

  const hasLiveData =
    snapshot.properties.length > 0 || snapshot.testimonials.length > 0

  if (!hasLiveData) {
    return { snapshot: getStaticSnapshot(), mode: 'static', cmsEmpty: true }
  }

  return {
    snapshot,
    mode: 'live',
    cmsEmpty: snapshot.properties.length === 0,
  }
}
