import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { CmsProvider } from '#/contexts/CmsContext'
import { AdminAuthProvider } from '#/contexts/AdminAuthContext'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: 'Valence Capital — Long-Term Capital. Clear Conviction.',
      },
      {
        name: 'description',
        content:
          'Valence Capital is a private investment firm focused on building long-term conviction across capital markets.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&family=Inter:wght@300;400;500&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const isAdmin = useRouterState({
    select: (s) => s.location.pathname.startsWith('/admin'),
  })

  return (
    <AdminAuthProvider>
      <CmsProvider skipFetch={isAdmin}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </CmsProvider>
    </AdminAuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
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
