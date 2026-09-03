import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Footer } from '../components/Footer'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { NavBar } from '../components/NavBar'
import { NotFound } from '../components/NotFound'
import { Sidebar } from '../components/Sidebar'
import { categoryCounts } from '../data/listings'
import { useLocale } from '../i18n'
import { SIDEBAR_ENABLED } from '../lib/constants'
import { GA_INIT_SCRIPT, GA_SCRIPT_SRC, IS_GATAG } from '../lib/gtag'
import { THEME_INIT_SCRIPT } from '../lib/theme'
import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
  loader: () => ({
    categories: categoryCounts(),
  }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.png', type: 'image/png' },
    ],
    scripts: IS_GATAG
      ? [
          { src: GA_SCRIPT_SRC, async: true },
          { children: GA_INIT_SCRIPT },
        ]
      : [],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  const { categories } = Route.useLoaderData()

  return (
    <RootDocument categories={categories}>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({
  children,
  categories,
}: Readonly<{ children: ReactNode; categories: { category: string; count: number }[] }>) {
  const locale = useLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body
        className="min-h-screen bg-bg font-sans text-text antialiased"
        data-scroll-restoration-id="body"
      >
        <div className="flex min-h-screen">
          {SIDEBAR_ENABLED ? <Sidebar categories={categories} /> : null}
          <div className="flex min-w-0 flex-1 flex-col">
            <NavBar />
            <main className="mx-auto w-full min-w-0 max-w-[1100px] flex-1 px-6 pt-6 pb-8 lg:px-10">
              {children}
              <Footer />
            </main>
          </div>
        </div>
        <GoogleAnalytics />
        <Scripts />
      </body>
    </html>
  )
}
