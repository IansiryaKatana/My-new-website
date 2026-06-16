import { createFileRoute } from '@tanstack/react-router'
import type {} from '@tanstack/react-start'

import { getSupabase } from '../integrations/supabase/client'
import { siteConfig } from '../data/site'
import { projects as staticProjects } from '../data/projects'
import { projectCaseStudyPath } from '../lib/projectLinks'

const STATIC_PATHS = [
  '/',
  '/about',
  '/certifications',
  '/portfolio',
  '/live-demos',
  '/experience',
  '/contact',
]

type IntentPageRow = {
  slug: string
  meta: unknown
  intent_page: boolean
}

function isIndexableIntentPage(row: IntentPageRow) {
  if (!row.intent_page) return false
  if (typeof row.meta !== 'object' || row.meta === null) return true
  const meta = row.meta as Record<string, unknown>
  return meta.noindex !== true
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        let projectSlugs = staticProjects.map((p) => p.slug)
        let experienceSlugs: string[] = []
        let intentPageSlugs: string[] = []

        const sb = getSupabase()
        if (sb) {
          const { data: projectData } = await sb
            .from('projects')
            .select('slug')
            .eq('published', true)
            .order('sort_order')

          if (projectData?.length) {
            projectSlugs = projectData.map((row) => row.slug)
          }

          const { data: experienceData } = await sb
            .from('experience_items')
            .select('slug')
            .eq('published', true)
            .not('slug', 'is', null)
            .order('sort_order')

          if (experienceData?.length) {
            experienceSlugs = experienceData
              .map((row) => row.slug)
              .filter((slug): slug is string => Boolean(slug))
          }

          const { data: marketingData } = await sb
            .from('marketing_pages')
            .select('slug,meta,intent_page')
            .eq('published', true)
            .eq('intent_page', true)
            .order('sort_order')

          if (marketingData?.length) {
            intentPageSlugs = (marketingData as IntentPageRow[])
              .filter(isIndexableIntentPage)
              .map((row) => row.slug)
          }
        }

        const urls = [
          ...STATIC_PATHS.map((path) => ({
            loc: `${siteConfig.url}${path === '/' ? '' : path}`,
            changefreq: path === '/' || path === '/portfolio' ? 'weekly' : 'monthly',
            priority: path === '/' ? '1.0' : path === '/portfolio' ? '0.9' : '0.8',
          })),
          ...projectSlugs.map((slug) => ({
            loc: `${siteConfig.url}${projectCaseStudyPath(slug)}`,
            changefreq: 'monthly',
            priority: '0.7',
          })),
          ...experienceSlugs.map((slug) => ({
            loc: `${siteConfig.url}/experience/${slug}`,
            changefreq: 'monthly',
            priority: '0.7',
          })),
          ...intentPageSlugs.map((slug) => ({
            loc: `${siteConfig.url}/i/${slug}`,
            changefreq: 'weekly',
            priority: '0.8',
          })),
        ]

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
      },
    },
  },
})
