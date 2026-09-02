import { useMemo, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { createFileRoute } from '@tanstack/react-router'
import { AppCard } from '../components/AppCard'
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
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return apps
    return apps.filter((app) => {
      const haystack = [app.name, app.tagline, app.description, app.developer.name]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [apps, query])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <label className="mt-6 flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
        <IconSearch size={20} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search apps"
          className="w-full bg-transparent outline-none"
        />
      </label>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        {filtered.length} {filtered.length === 1 ? 'app' : 'apps'}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  )
}
