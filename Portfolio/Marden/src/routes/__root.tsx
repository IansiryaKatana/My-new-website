import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AdminAuthProvider } from '#/contexts/AdminAuthContext'
import { CmsProvider } from '#/contexts/CmsContext'
import appCss from '../styles.css?url'
import adminCss from '../admin/admin-theme.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Marden - Renewable Energy Infrastructure' },
      {
        name: 'description',
        content:
          'Marden develops, finances, and operates renewable energy infrastructure at global scale.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: adminCss },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AdminAuthProvider>
          {isAdmin ? children : <CmsProvider>{children}</CmsProvider>}
        </AdminAuthProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
