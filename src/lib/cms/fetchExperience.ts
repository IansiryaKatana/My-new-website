import type { SupabaseClient } from '@supabase/supabase-js'

import type { Tables } from '../../integrations/supabase/database.types'
import { experience as staticExperience } from '../../data/experience'
import { mapExperience } from './mappers'
import { getExperienceBySlug } from '../experienceLinks'

export async function fetchExperienceBySlug(
  supabase: SupabaseClient,
  slug: string,
) {
  const { data, error } = await supabase.rpc('get_experience_by_slug', {
    p_slug: slug,
  })

  if (!error && data && typeof data === 'object') {
    return mapExperience(data as Tables<'experience_items'>)
  }

  return getExperienceBySlug(staticExperience, slug) ?? null
}
