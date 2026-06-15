import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '#/integrations/supabase/database.types'
import { getStaticCmsSnapshot, mapCmsSnapshot } from '#/lib/cms/mappers'
import type { CmsSnapshot } from '#/lib/cms/types'

function collectErrors(errors: Array<{ message: string } | null>): string | null {
  const messages = errors
    .filter((error): error is { message: string } => error !== null)
    .map((error) => error.message)

  return messages.length > 0 ? messages.join('; ') : null
}

export async function loadCmsSnapshot(
  supabase: SupabaseClient<Database>,
): Promise<CmsSnapshot> {
  const [
    siteSettingsResult,
    productsResult,
    benefitsResult,
    navItemsResult,
    contentSectionsResult,
  ] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('benefits')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('nav_items')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true }),
    supabase.from('content_sections').select('*').eq('published', true),
  ])

  const errorMessage = collectErrors([
    siteSettingsResult.error,
    productsResult.error,
    benefitsResult.error,
    navItemsResult.error,
    contentSectionsResult.error,
  ])

  if (errorMessage) {
    throw new Error(errorMessage)
  }

  return mapCmsSnapshot({
    siteSettings: siteSettingsResult.data ?? [],
    products: productsResult.data ?? [],
    benefits: benefitsResult.data ?? [],
    navItems: navItemsResult.data ?? [],
    contentSections: contentSectionsResult.data ?? [],
  })
}

export function isCmsSnapshotEmpty(snapshot: CmsSnapshot): boolean {
  return snapshot.products.length === 0
}

export function resolveCmsSnapshot(snapshot: CmsSnapshot): CmsSnapshot {
  if (isCmsSnapshotEmpty(snapshot)) {
    return getStaticCmsSnapshot()
  }

  return snapshot
}
