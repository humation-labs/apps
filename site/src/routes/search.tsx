import { useMemo } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AppRow } from '../components/AppRow'
import { categoryLabel } from '../lib/constants'
import { pageHead } from '../lib/head'
import { allListings } from '../data/listings'

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  loader: () => allListings(),
  head: () =>
    pageHead({
      title: 'Search',
      description: 'Search apps and web services built with Humation.',
      path: '/search',
    }),
  component: SearchPage,
})

function SearchPage() {
  const apps = Route.useLoaderData()
  const { q } = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })
  const query = q ?? ''
  const trimmed = query.trim()

  const filtered = useMemo(() => {
    const needle = trimmed.toLowerCase()
    if (!needle) return []
    return apps.filter((app) => {
      const haystack = [app.name, app.tagline, app.developer.name, categoryLabel(app.category)]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [apps, trimmed])

  return (
    <div className="min-w-0">
      <h1 className="text-4xl/tight font-bold tracking-tight">Search</h1>
      <label className="mt-6 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg">
        <span className="icon-align inline-flex size-5 shrink-0 items-center justify-center text-text-muted">
          <IconSearch size={20} stroke={1.5} aria-hidden />
        </span>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => {
            const next = event.target.value
            void navigate({
              search: { q: next === '' ? undefined : next },
              replace: true,
            })
          }}
          placeholder="Search"
          autoFocus
          aria-label="Search apps"
          className="w-full min-w-0 bg-transparent text-lg outline-none placeholder:text-text-muted"
        />
      </label>
      {trimmed === '' ? (
        <p className="mt-4 text-text-muted">
          Search apps by name, tagline, developer or category.
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-4 text-text-muted">No apps match "{trimmed}".</p>
      ) : (
        <div className="mt-4 min-w-0">
          {filtered.map((app) => (
            <AppRow key={app.slug} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}
