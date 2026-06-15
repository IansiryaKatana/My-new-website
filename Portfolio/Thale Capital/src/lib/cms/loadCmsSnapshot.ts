import { getSupabase } from '../../integrations/supabase/client'
import { fallbackSnapshot, type CmsSnapshot } from './types'

export async function loadCmsSnapshot(): Promise<CmsSnapshot> {
  const sb = getSupabase()
  if (!sb) return fallbackSnapshot

  const [settingsRes, pillarsRes, investmentsRes] = await Promise.all([
    sb.from('site_settings').select('key, value'),
    sb
      .from('pillars')
      .select('id, title, description, sort_order, is_highlighted')
      .order('sort_order', { ascending: true }),
    sb
      .from('investments')
      .select('id, title, industry, year, description, image_url, is_featured')
      .order('year', { ascending: false }),
  ])

  if (settingsRes.error || pillarsRes.error || investmentsRes.error) {
    return fallbackSnapshot
  }

  return {
    mode: 'live',
    siteSettings:
      settingsRes.data && settingsRes.data.length > 0
        ? settingsRes.data
        : fallbackSnapshot.siteSettings,
    pillars:
      pillarsRes.data && pillarsRes.data.length > 0
        ? pillarsRes.data
        : fallbackSnapshot.pillars,
    investments:
      investmentsRes.data && investmentsRes.data.length > 0
        ? investmentsRes.data
        : fallbackSnapshot.investments,
  }
}
