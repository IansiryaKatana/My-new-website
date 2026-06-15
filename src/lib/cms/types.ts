import type { CertificationItem, EducationItem } from '../../data/credentials'
import type { Project } from '../../data/projects'
import type { ExperienceItem } from '../../data/experience'
import type { heroContent } from '../../data/hero-content'
import type { siteConfig } from '../../data/site'

export type SiteConfig = typeof siteConfig
export type HeroContent = typeof heroContent

export type SkillGroupView = {
  title: string
  items: string[]
}

export type MarketingPageView = {
  slug: string
  title: string
  eyebrow: string | null
  description: string
  bodyHtml: string
  sections: Record<string, unknown>
  meta: Record<string, unknown>
}

export type CmsSnapshot = {
  siteConfig: SiteConfig
  heroContent: HeroContent
  projects: Project[]
  experience: ExperienceItem[]
  skillGroups: SkillGroupView[]
  education: EducationItem[]
  certifications: CertificationItem[]
  marketingPages: Record<string, MarketingPageView>
  cmsEmpty: boolean
}

export type CmsMode = 'static' | 'live'

