import type { Project } from '../../data/projects'
import type { CmsSnapshot } from './types'

export function getProjectBySlug(projects: Project[], slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(projects: Project[]) {
  return projects.filter((p) => p.featured)
}

export function getHomeExperiencePreview(
  experience: CmsSnapshot['experience'],
  limit = 2,
) {
  return experience.slice(0, limit)
}

