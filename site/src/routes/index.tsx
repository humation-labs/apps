import { Link, createFileRoute } from '@tanstack/react-router'
import { AddAppButton } from '../components/AddAppButton'
import { AppRowGrid } from '../components/AppRowGrid'
import { CategoryIcon } from '../components/CategoryIcon'
import { HeroCarousel } from '../components/HeroCarousel'
import { Section } from '../components/Section'
import { ADD_APP_PROMPT, CONTRIBUTING_URL, SITE_NAME, categoryLabel } from '../lib/constants'
import { pageHead } from '../lib/head'
import { byCategory, categoryCounts, featured, newest } from '../data/listings'

export const Route = createFileRoute('/')({
  loader: () => ({
    featured: featured(),
    newest: newest(18),
    categories: categoryCounts().map(({ category, count }) => ({
      category,
      count,
      apps: byCategory(category).slice(0, 9),
    })),
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
    <div className="min-w-0">
      <h1 className="text-4xl/tight font-bold tracking-tight">Apps</h1>

      {categories.length > 0 ? (
        <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-2 overflow-x-auto">
          {categories.map(({ category }) => (
            <Link
              key={category}
              to="/category/$category"
              params={{ category }}
              className="inline-flex h-8 shrink-0 snap-start items-center gap-2 rounded-full bg-surface-2 px-3 text-[13px] font-medium hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <CategoryIcon category={category} size={16} className="icon-align -ml-0.5" />
              {categoryLabel(category)}
            </Link>
          ))}
        </div>
      ) : null}

      {featuredApps.length > 0 ? (
        <div className="mt-6 min-w-0">
          <HeroCarousel apps={featuredApps} />
        </div>
      ) : null}

      <Section title="New" subtitle="Recently added" to="/">
        {newestApps.length === 0 ? (
          <p className="text-text-muted">No listings yet.</p>
        ) : (
          <AppRowGrid apps={newestApps} />
        )}
      </Section>

      {categories.map(({ category, apps }) => (
        <Section
          key={category}
          title={categoryLabel(category)}
          to="/category/$category"
          params={{ category }}
        >
          <AppRowGrid apps={apps} />
        </Section>
      ))}

      <section className="mt-12 rounded-2xl bg-surface p-6" aria-label="Add your app">
        <h2 className="text-xl font-semibold tracking-tight">Built something with Humation?</h2>
        <p className="mt-2 text-[14px] text-text-muted">
          Paste this into the coding agent you use in your project and it will open the pull
          request for you.
        </p>
        <div className="mt-4 flex min-w-0 items-start gap-2">
          <code className="block min-w-0 flex-1 font-mono text-[13px] leading-relaxed break-words rounded-lg bg-surface-2 p-3">
            {ADD_APP_PROMPT}
          </code>
          <AddAppButton
            label="Copy"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-[14px] leading-none font-semibold text-white"
          />
        </div>
        <p className="mt-3 text-sm text-text-muted">
          <a
            href={CONTRIBUTING_URL}
            className="hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Or read CONTRIBUTING
          </a>
        </p>
      </section>
    </div>
  )
}
