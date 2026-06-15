import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createFileRoute } from '@tanstack/react-router'
import type {} from '@tanstack/react-start'

export const Route = createFileRoute('/favicon.ico')({
  server: {
    handlers: {
      GET: async () => {
        const svgPath = join(process.cwd(), 'static-public', 'favicon.svg')
        const body = readFileSync(svgPath)

        return new Response(body, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      },
    },
  },
})
