/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content:
          'Aurora is a premium wellness and nutrition landing page for guided self-care, treatment discovery, and daily formulas.',
      },
      { title: 'Aurora Wellness - Thoughtful care for your body' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      { rel: 'preload', as: 'image', href: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2200&q=82' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
