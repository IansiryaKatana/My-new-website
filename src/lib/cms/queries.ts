import type { Project } from '../../data/projects'
import { isDemoPreviewPath } from '../demoLinks'
import type { CmsSnapshot } from './types'

export function getProjectBySlug(projects: Project[], slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(projects: Project[]) {
  return projects.filter((p) => p.featured)
}

export function getLiveDemoProjects(projects: Project[]) {
  return projects.filter((project) => {
    const href = project.href?.trim()
    const cover = project.coverImageUrl?.trim()
    if (!href || !cover) return false

    const path = href.startsWith('/') ? href : `/${href}`
    return isDemoPreviewPath(path)
  })
}

export function getHomeExperiencePreview(
  experience: CmsSnapshot['experience'],
  limit = 2,
) {
  return experience.slice(0, limit)
}

