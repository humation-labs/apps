import { Link, createFileRoute } from '@tanstack/react-router'
import { AppCard } from '../components/AppCard'
import { AddAppButton } from '../components/AddAppButton'
import { ADD_APP_PROMPT, CONTRIBUTING_URL, SITE_NAME, categoryLabel } from '../lib/constants'
import { pageHead } from '../lib/head'
import { categoryCounts, featured, newest } from '../data/listings'

export const Route = createFileRoute('/')({
  loader: () => ({
    featured: featured(),
    newest: newest(12),
    categories: categoryCounts(),
  }),
  head: () =>
    pageHead({
      title: SITE_NAME,
      description:
        'A catalog of apps and web services built with Humation, the hand-drawn deterministic avatar engine.',
      path: '/',
    }),
  component: Home,
})

function Home() {
  const { featured: featuredApps, newest: newestApps, categories } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Apps built with Humation</h1>
          <p className="mt-3 max-w-xl text-zinc-600 dark:text-zinc-400">
            An App Store for products that use the hand-drawn deterministic avatar engine. Listings
            are added by pull request.
          </p>
        </div>
        <aside className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800" aria-label="Add your app">
          <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
            Paste it into the coding agent you use in your project.
          </p>
          <p className="mb-3 text-xs">
            <a href={CONTRIBUTING_URL} className="text-blue-600">
              Or read CONTRIBUTING
            </a>
          </p>
          <div className="flex items-start gap-2">
            <code className="block min-w-0 flex-1 whitespace-pre-wrap rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
              {ADD_APP_PROMPT}
            </code>
            <AddAppButton label="Copy" />
          </div>
        </aside>
      </section>

      {featuredApps.length > 0 ? (
        <section className="mb-12" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="mb-4 text-2xl font-bold">
            Featured
          </h2>
          <div className="grid gap-4">
            {featuredApps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-12" aria-labelledby="new-heading">
        <h2 id="new-heading" className="mb-4 text-2xl font-bold">
          New
        </h2>
        {newestApps.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No listings yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newestApps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-4 text-2xl font-bold">
          Browse by category
        </h2>
        {categories.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No categories yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ category, count }) => (
              <Link
                key={category}
                to="/category/$category"
                params={{ category }}
                className="rounded-xl border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800"
              >
                <h3 className="font-semibold">{categoryLabel(category)}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {count} {count === 1 ? 'app' : 'apps'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
