import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { createFileRoute } from '@tanstack/react-router'
import type {} from '@tanstack/react-start'

export const Route = createFileRoute('/favicon.ico')({
  server: {
    handlers: {
      GET: async () => {
        const iconPath = join(process.cwd(), 'static-public', 'favicon.png')
        const body = readFileSync(iconPath)

        return new Response(body, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      },
    },
  },
})
