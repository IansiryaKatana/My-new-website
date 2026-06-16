import {

  HeadContent,
  Link,

  Outlet,

  Scripts,

  createRootRoute,

} from '@tanstack/react-router'

import type { ReactNode } from 'react'

import stylesUrl from '../styles.css?url'

import { AdminAuthProvider } from '../contexts/AdminAuthContext'
import { GoogleAnalyticsPageviews } from '../components/analytics/GoogleAnalytics'
import { InquiryProvider } from '../contexts/InquiryContext'
import { CmsProvider } from '../contexts/CmsContext'
import { InquiryDialog } from '../components/inquiry/InquiryDialog'
import { PageTransition } from '../components/layout/PageTransition'
import { siteConfig } from '../data/site'

import { fontCopy } from '../lib/typography'
import { createPageMeta } from '../lib/seo'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'



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

        href: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&family=Geist:wght@200&display=swap',

      },

      {

        rel: 'stylesheet',

        href: stylesUrl,

      },

      {

        rel: 'icon',

        type: 'image/png',

        href: '/favicon.png',

      },

      {

        rel: 'apple-touch-icon',

        href: '/favicon.png',

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
          <p className={`mt-4 text-sm text-[#D8D7C3]/80 ${fontCopy}`}>
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    </RootDocument>
  ),
  notFoundComponent: NotFoundPage,

  component: RootComponent,

})



function RootComponent() {

  return (

    <RootDocument>

      <AdminAuthProvider>

        <CmsProvider>

          <InquiryProvider>

            <PageTransition>

              <Outlet />

            </PageTransition>
            <GoogleAnalyticsPageviews />

            <InquiryDialog />

          </InquiryProvider>

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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DHFJ0GMM6N"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', 'G-DHFJ0GMM6N', { send_page_view: false });
            `,
          }}
        />

      </head>

      <body>

        {children}

        <Scripts />

      </body>

    </html>

  )

}

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#10140D] px-6 py-14 text-[#D8D7C3] sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-6xl flex-col justify-center border border-[#D8D7C3]/20 bg-[#11140F]/70 p-6 sm:p-10">
        <p className="font-display text-xs font-black uppercase tracking-[0.2em] text-[#D8D7C3]/65">
          Error 404
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl lg:text-8xl">
          The page you requested is missing
        </h1>
        <p className={`mt-5 max-w-2xl text-sm text-[#D8D7C3]/80 sm:text-base ${fontCopy}`}>
          The route may have changed, the link may be outdated, or the page might no longer be
          published. Continue with one of the options below.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link to="/" className={cn(buttonVariants({ variant: 'accent' }), 'w-full sm:w-auto')}>
            Go to homepage
          </Link>
          <Link
            to="/portfolio"
            className={cn(buttonVariants({ variant: 'lightMuted' }), 'w-full sm:w-auto')}
          >
            Explore portfolio
          </Link>
          <Link
            to="/contact"
            className={cn(buttonVariants({ variant: 'forest' }), 'w-full sm:w-auto')}
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  )
}

