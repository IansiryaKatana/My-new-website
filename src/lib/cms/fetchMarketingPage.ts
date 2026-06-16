import { getSupabase } from '../../integrations/supabase/client'
import { loadMarketingPageBySlug } from './loadCmsSnapshot'

export async function fetchMarketingPageBySlug(slug: string) {
  const sb = getSupabase()
  if (!sb) return null
  return loadMarketingPageBySlug(sb, slug)
}
