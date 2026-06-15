import { certifications, education } from '../../data/credentials'
import { heroContent } from '../../data/hero-content'
import { experience } from '../../data/experience'
import { projects } from '../../data/projects'
import { skillGroups } from '../../data/skills'
import { siteConfig } from '../../data/site'

import type { CmsSnapshot } from './types'

export function getStaticCmsSnapshot(): CmsSnapshot {
  return {
    siteConfig,
    heroContent,
    projects,
    experience,
    skillGroups: skillGroups.map((g) => ({
      title: g.title,
      items: [...g.items],
    })),
    education,
    certifications,
    marketingPages: {},
    cmsEmpty: false,
  }
}

