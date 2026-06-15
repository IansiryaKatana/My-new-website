import fallback from '#/data/cms-fallback.json'
import { getSupabase } from '#/integrations/supabase/client'
import type { CmsSnapshot } from './types'

function staticSnapshot(): CmsSnapshot {
  return fallback as CmsSnapshot
}

export async function loadCmsSnapshot(): Promise<{
  snapshot: CmsSnapshot
  mode: 'static' | 'live'
  cmsEmpty: boolean
}> {
  const sb = getSupabase()
  if (!sb) {
    return { snapshot: staticSnapshot(), mode: 'static', cmsEmpty: false }
  }

  try {
    const [
      settingsRes,
      navRes,
      heroRes,
      metricsRes,
      projectsRes,
      servicesRes,
      capabilitiesRes,
      stagesRes,
      mapSectionRes,
      mapLocRes,
      footerRes,
      socialRes,
      projectsCopyRes,
      processCopyRes,
    ] = await Promise.all([
      sb.from('site_settings').select('key, value'),
      sb.from('navigation_links').select('*').eq('published', true).order('sort_order'),
      sb.from('hero_content').select('*').eq('published', true).limit(1).maybeSingle(),
      sb.from('metrics').select('*').eq('published', true).order('sort_order'),
      sb.from('projects').select('*').eq('published', true).order('sort_order'),
      sb.from('services').select('*').eq('published', true).order('sort_order'),
      sb.from('capabilities_section').select('*').eq('published', true).limit(1).maybeSingle(),
      sb.from('process_stages').select('*').eq('published', true).order('sort_order'),
      sb.from('map_section').select('*').eq('published', true).limit(1).maybeSingle(),
      sb.from('map_locations').select('*').eq('published', true).order('sort_order'),
      sb.from('footer_columns').select('*').eq('published', true).order('sort_order'),
      sb.from('social_links').select('*').eq('published', true).order('sort_order'),
      sb.from('section_copy').select('*').eq('section_key', 'projects').eq('published', true).maybeSingle(),
      sb.from('section_copy').select('*').eq('section_key', 'process').eq('published', true).maybeSingle(),
    ])

    const hasData =
      (heroRes.data && projectsRes.data && projectsRes.data.length > 0) ||
      (navRes.data && navRes.data.length > 0)

    if (!hasData) {
      return { snapshot: staticSnapshot(), mode: 'static', cmsEmpty: true }
    }

    const siteSettings: Record<string, unknown> = {}
    for (const row of settingsRes.data ?? []) {
      siteSettings[row.key] = row.value
    }

    const fb = staticSnapshot()
    const hero = heroRes.data
    const capabilities = capabilitiesRes.data

    const snapshot: CmsSnapshot = {
      siteSettings: Object.keys(siteSettings).length ? siteSettings : fb.siteSettings,
      navigation: (navRes.data ?? []).map((n) => ({
        id: n.id,
        label: n.label,
        href: n.href,
        sort_order: n.sort_order,
        is_cta: n.is_cta,
      })),
      hero: hero
        ? {
            headline_line1: hero.headline_line1,
            headline_line2: hero.headline_line2,
            subcopy: hero.subcopy ?? '',
            cta_label: hero.cta_label,
            cta_url: hero.cta_url,
            background_image_url: hero.background_image_url,
            thumbnail_image_url: hero.thumbnail_image_url ?? fb.hero.thumbnail_image_url,
          }
        : fb.hero,
      metrics: (metricsRes.data ?? []).map((m) => ({
        id: m.id,
        value: m.value,
        label: m.label,
        sort_order: m.sort_order,
        featured: m.featured,
      })),
      projectsSection: projectsCopyRes.data
        ? {
            eyebrow: projectsCopyRes.data.eyebrow ?? undefined,
            heading: projectsCopyRes.data.heading ?? undefined,
            body: projectsCopyRes.data.body ?? undefined,
          }
        : fb.projectsSection,
      projects: (projectsRes.data ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        phase: p.phase ?? undefined,
        location: p.location ?? undefined,
        image_url: p.image_url,
        category: p.category,
        layout: p.layout as 'stacked' | 'featured',
        cta_label: p.cta_label,
        cta_url: p.cta_url,
        sort_order: p.sort_order,
      })),
      capabilities: capabilities
        ? {
            eyebrow: capabilities.eyebrow,
            heading: capabilities.heading,
            body: capabilities.body ?? '',
            cta_label: capabilities.cta_label,
            cta_url: capabilities.cta_url,
            background_image_url: capabilities.background_image_url,
            services_card_title: capabilities.services_card_title,
          }
        : fb.capabilities,
      services: (servicesRes.data ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description ?? undefined,
        active: s.active,
        sort_order: s.sort_order,
      })),
      processSection: processCopyRes.data
        ? {
            eyebrow: processCopyRes.data.eyebrow ?? undefined,
            heading: processCopyRes.data.heading ?? undefined,
            body: processCopyRes.data.body ?? undefined,
            image_url: (processCopyRes.data as { image_url?: string }).image_url,
          }
        : fb.processSection,
      processStages: (stagesRes.data ?? []).map((s) => ({
        id: s.id,
        number: s.number,
        title: s.title,
        description: s.description,
        sort_order: s.sort_order,
      })),
      mapSection: mapSectionRes.data
        ? {
            heading: mapSectionRes.data.heading,
            cta_label: mapSectionRes.data.cta_label,
            cta_url: mapSectionRes.data.cta_url,
          }
        : fb.mapSection,
      mapLocations: (mapLocRes.data ?? []).map((l) => ({
        id: l.id,
        country: l.country,
        region: l.region ?? undefined,
        x_percent: Number(l.x_percent),
        y_percent: Number(l.y_percent),
        status: l.status as 'active' | 'inactive',
      })),
      footerColumns: (footerRes.data ?? []).map((c) => ({
        id: c.id,
        title: c.title,
        links: (c.links as { label: string; href: string }[]) ?? [],
        sort_order: c.sort_order,
      })),
      socialLinks: (socialRes.data ?? []).map((s) => ({
        id: s.id,
        label: s.label,
        href: s.href,
        sort_order: s.sort_order,
      })),
    }

    return {
      snapshot,
      mode: 'live',
      cmsEmpty: !projectsRes.data?.length,
    }
  } catch {
    return { snapshot: staticSnapshot(), mode: 'static', cmsEmpty: false }
  }
}
