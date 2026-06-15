import type { ExperienceItem } from '../data/experience'

export function experienceDetailPath(slug: string) {
  return `/experience/${slug}`
}

export function getExperienceBySlug(
  experience: ExperienceItem[],
  slug: string,
) {
  return experience.find((item) => item.slug === slug)
}

export function formatEmploymentMeta(item: ExperienceItem) {
  const parts = [item.employmentType, item.workMode].filter(Boolean)
  return parts.join(' · ')
}
