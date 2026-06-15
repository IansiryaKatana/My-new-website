import { createFileRoute } from '@tanstack/react-router'
import type {} from '@tanstack/react-start'

import { getSupabase } from '../integrations/supabase/client'
import { siteConfig } from '../data/site'
import { projects as staticProjects } from '../data/projects'
import { projectCaseStudyPath } from '../lib/projectLinks'

const STATIC_PATHS = ['/', '/about', '/portfolio', '/experience', '/contact']

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        let projectSlugs = staticProjects.map((p) => p.slug)

        const sb = getSupabase()
        if (sb) {
          const { data } = await sb
            .from('projects')
            .select('slug')
            .eq('published', true)
            .order('sort_order')

          if (data?.length) {
            projectSlugs = data.map((row) => row.slug)
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
