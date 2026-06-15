import {

  HeadContent,

  Outlet,

  Scripts,

  createRootRoute,

} from '@tanstack/react-router'

import type { ReactNode } from 'react'

import stylesUrl from '../styles.css?url'

import { AdminAuthProvider } from '../contexts/AdminAuthContext'
import { CmsProvider } from '../contexts/CmsContext'
import { siteConfig } from '../data/site'

import { createPageMeta } from '../lib/seo'



export const Route = createRootRoute({

  head: () => ({

    ...createPageMeta({

      title: siteConfig.title,

      description: siteConfig.tagline,

      path: '/',

    }),

    meta: [

      { charSet: 'utf-8' },

      {

        name: 'viewport',

        content: 'width=device-width, initial-scale=1',

      },

      {

        name: 'author',

        content: siteConfig.name,

      },

      {

        name: 'keywords',

        content:

          'full stack developer, react developer, typescript, portfolio, web applications, product engineering',

      },

      { name: 'robots', content: 'index, follow' },

      {

        title: siteConfig.title,

      },

      {

        name: 'description',

        content: siteConfig.tagline,

      },

    ],

    links: [

      {

        rel: 'preconnect',

        href: 'https://fonts.googleapis.com',

      },

      {

        rel: 'preconnect',

        href: 'https://fonts.gstatic.com',

        crossOrigin: 'anonymous',

      },

      {

        rel: 'stylesheet',

        href: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&display=swap',

      },

      {

        rel: 'stylesheet',

        href: stylesUrl,

      },

      {

        rel: 'icon',

        type: 'image/svg+xml',

        href: '/favicon.svg',

      },

      {

        rel: 'apple-touch-icon',

        href: '/favicon.svg',

      },

      {

        rel: 'sitemap',

        type: 'application/xml',

        href: '/sitemap.xml',

      },

    ],

  }),

  errorComponent: ({ error }) => (
    <RootDocument>
      <div className="min-h-screen bg-[#10140D] px-6 py-16 text-[#D8D7C3] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl border border-[#D8D7C3]/20 p-6">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-[#D8D7C3]/65">
            Application error
          </p>
          <h1 className="mt-3 font-display text-3xl font-black uppercase">
            Something went wrong
          </h1>
          <p className="mt-4 text-sm text-[#D8D7C3]/80">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    </RootDocument>
  ),

  component: RootComponent,

})



function RootComponent() {

  return (

    <RootDocument>

      <AdminAuthProvider>

        <CmsProvider>

          <Outlet />

        </CmsProvider>

      </AdminAuthProvider>

    </RootDocument>

  )

}



function RootDocument({ children }: { children: ReactNode }) {

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

