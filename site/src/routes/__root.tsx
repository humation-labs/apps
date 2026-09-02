import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { NotFound } from '../components/NotFound'
import { Sidebar } from '../components/Sidebar'
import { categoryCounts } from '../data/listings'
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
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <div className="flex min-h-screen">
          <Sidebar categories={categories} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="mx-auto w-full min-w-0 max-w-[1100px] flex-1 px-6 py-8 lg:px-10">
              {children}
              <Footer />
            </main>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
