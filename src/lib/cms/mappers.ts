import type { Tables } from '../../integrations/supabase/database.types'
import type { CertificationItem, EducationItem } from '../../data/credentials'
import type { ExperienceItem } from '../../data/experience'
import type { Project } from '../../data/projects'
import type { HeroContent, MarketingPageView, SiteConfig, SkillGroupView } from './types'

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asNavItems(
  value: unknown,
): Array<{ label: string; href: string; description?: string }> {
  if (!Array.isArray(value)) return []
  return value
    .filter(
      (item): item is { label: string; href: string; description?: string } =>
        typeof item === 'object' &&
        item !== null &&
        'label' in item &&
        'href' in item &&
        typeof (item as { label: unknown }).label === 'string' &&
        typeof (item as { href: unknown }).href === 'string',
    )
    .map((item) => ({
      label: item.label,
      href: item.href,
      ...(item.description ? { description: item.description } : {}),
    }))
}

export function mapSiteSettings(
  rows: Tables<'site_settings'>[],
  fallback: SiteConfig,
): SiteConfig {
  const profile = rows.find((r) => r.key === 'profile')?.value as
    | Partial<SiteConfig>
    | undefined

  if (!profile) return fallback

  return {
    ...fallback,
    ...profile,
    social: { ...fallback.social, ...profile.social },
    navigation: profile.navigation ?? fallback.navigation,
    homeSections: profile.homeSections ?? fallback.homeSections,
  } as SiteConfig
}

export function mapHero(
  row: Tables<'hero_content'> | null,
  fallback: HeroContent,
  defaultSubjectSrc: string,
): HeroContent {
  if (!row) return fallback

  return {
    name: row.name,
    role: row.role,
    leftIntro: asStringArray(row.left_intro),
    expertise: row.expertise,
    rightIntro: asStringArray(row.right_intro),
    rightSecondary: asStringArray(row.right_secondary),
    cta: { label: row.cta_label, href: row.cta_href },
    startProject: {
      label: row.start_project_label,
      href: row.start_project_href,
    },
    tags: asStringArray(row.tags),
    subject: {
      src: row.subject_image_url ?? defaultSubjectSrc,
      alt: row.subject_alt ?? fallback.subject.alt,
    },
    ticker: asStringArray(row.ticker),
    navigation: asNavItems(row.navigation).map(({ label, href }) => ({
      label,
      href,
    })),
    badge: row.badge_text ?? fallback.badge ?? '',
  }
}

export function mapProject(row: Tables<'projects'>): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    year: row.year,
    role: row.role,
    stack: asStringArray(row.stack),
    tags: asStringArray(row.tags),
    outcomes: asStringArray(row.outcomes),
    featured: row.featured,
    href: row.href ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
    featuredImageUrl: row.featured_image_url ?? undefined,
    thumbnailUrls: asStringArray(row.thumbnail_urls),
    seoDescription: row.seo_description || undefined,
  }
}

export function mapExperience(row: Tables<'experience_items'>): ExperienceItem {
  return {
    slug: row.slug ?? '',
    company: row.company,
    role: row.role,
    period: row.period,
    location: row.location,
    employmentType: row.employment_type ?? '',
    workMode: row.work_mode ?? '',
    summary: row.summary,
    detailIntro: row.detail_intro ?? row.summary,
    highlights: asStringArray(row.highlights),
    responsibilities: asStringArray(row.responsibilities),
    technologies: asStringArray(row.technologies),
    seoDescription: row.seo_description ?? row.summary,
    isCurrent: row.is_current ?? false,
    previewLimit: row.preview_limit ?? 3,
  }
}

export function mapEducation(row: Tables<'education_items'>): EducationItem {
  return {
    degree: row.degree,
    institution: row.institution,
    issuedLabel: row.issued_label,
    summary: row.summary,
  }
}

export function mapCertification(row: Tables<'certification_items'>): CertificationItem {
  return {
    title: row.title,
    issuer: row.issuer,
    issuedLabel: row.issued_label,
    credentialUrl: row.credential_url ?? undefined,
  }
}

export function mapSkillGroups(
  groups: Tables<'skill_groups'>[],
  items: Tables<'skill_items'>[],
): SkillGroupView[] {
  return groups
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((group) => ({
      title: group.title,
      items: items
        .filter((item) => item.group_id === group.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.label),
    }))
}

export function mapMarketingPage(row: Tables<'marketing_pages'>): MarketingPageView {
  return {
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow,
    description: row.description,
    bodyHtml: row.body_html,
    sections:
      typeof row.sections === 'object' && row.sections !== null
        ? (row.sections as Record<string, unknown>)
        : {},
    meta:
      typeof row.meta === 'object' && row.meta !== null
        ? (row.meta as Record<string, unknown>)
        : {},
  }
}

