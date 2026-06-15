import { getSupabase } from '../../integrations/supabase/client'
import { getProject } from '../../data/projects'
import { loadProjectBySlug } from './loadCmsSnapshot'

export async function fetchProjectBySlug(slug: string) {
  const sb = getSupabase()
  if (sb) {
    const project = await loadProjectBySlug(sb, slug)
    if (project) return project
  }

  return getProject(slug) ?? null
}
