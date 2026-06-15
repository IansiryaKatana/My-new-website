import type { SupabaseClient } from '@supabase/supabase-js'

import heroImageSrc from '../../../hero.png'
import type { Tables } from '../../integrations/supabase/database.types'
import {
  mapCertification,
  mapEducation,
  mapExperience,
  mapHero,
  mapMarketingPage,
  mapProject,
  mapSiteSettings,
  mapSkillGroups,
} from './mappers'
import { getStaticCmsSnapshot } from './staticSnapshot'
import type { CmsSnapshot } from './types'

type RpcCmsSnapshot = {
  site_settings?: Tables<'site_settings'>[]
  hero_content?: Tables<'hero_content'> | null
  projects?: Tables<'projects'>[]
  experience_items?: Tables<'experience_items'>[]
  skill_groups?: Tables<'skill_groups'>[]
  skill_items?: Tables<'skill_items'>[]
  education_items?: Tables<'education_items'>[]
  certification_items?: Tables<'certification_items'>[]
  marketing_pages?: Tables<'marketing_pages'>[]
}

function buildSnapshotFromRows(
  rows: RpcCmsSnapshot,
  fallback: CmsSnapshot,
): CmsSnapshot {
  const settings = rows.site_settings ?? []
  const projectRows = rows.projects ?? []
  const experienceRows = rows.experience_items ?? []
  const skillGroupRows = rows.skill_groups ?? []
  const skillItemRows = rows.skill_items ?? []
  const educationRows = rows.education_items ?? []
  const certificationRows = rows.certification_items ?? []
  const marketingRows = rows.marketing_pages ?? []

  const projects = projectRows.map(mapProject)
  const cmsEmpty = projects.length === 0

  const marketingPages: CmsSnapshot['marketingPages'] = {}
  for (const row of marketingRows) {
    const page = mapMarketingPage(row)
    marketingPages[page.slug] = page
  }

  return {
    siteConfig: mapSiteSettings(settings, fallback.siteConfig),
    heroContent: mapHero(rows.hero_content ?? null, fallback.heroContent, heroImageSrc),
    projects: projects.length > 0 ? projects : fallback.projects,
    experience:
      experienceRows.length > 0
        ? experienceRows.map(mapExperience)
        : fallback.experience,
    skillGroups:
      skillGroupRows.length > 0
        ? mapSkillGroups(skillGroupRows, skillItemRows)
        : fallback.skillGroups,
    education:
      educationRows.length > 0
        ? educationRows.map(mapEducation)
        : fallback.education,
    certifications:
      certificationRows.length > 0
        ? certificationRows.map(mapCertification)
        : fallback.certifications,
    marketingPages,
    cmsEmpty,
  }
}

export async function loadCmsSnapshot(
  supabase: SupabaseClient,
): Promise<CmsSnapshot> {
  const fallback = getStaticCmsSnapshot()

  const { data, error } = await supabase.rpc('get_cms_snapshot')

  if (!error && data && typeof data === 'object') {
    return buildSnapshotFromRows(data as RpcCmsSnapshot, fallback)
  }

  return fallback
}

export async function loadProjectBySlug(
  supabase: SupabaseClient,
  slug: string,
) {
  const { data, error } = await supabase.rpc('get_project_by_slug', {
    p_slug: slug,
  })

  if (!error && data && typeof data === 'object') {
    return mapProject(data as Tables<'projects'>)
  }

  return null
}
