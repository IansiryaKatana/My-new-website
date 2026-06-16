import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '../data/site'

const ROBOTS = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: ${siteConfig.url}/sitemap.xml
Host: iankatana.com
`

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () =>
        new Response(ROBOTS, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }),
    },
  },
})
