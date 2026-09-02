import { useMemo } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { AppRow } from '../components/AppRow'
import { allListings } from '../data/listings'
import type { Listing } from '../data/listings'
import { categoryLabel, en, getDict, ja, localePath, useT, type Locale } from '../i18n'
import { pageHead } from '../lib/head'
import { usePageData, usePageSearch } from './usePageData'

export function searchRoute(locale: Locale) {
  return {
    validateSearch: (search: Record<string, unknown>): { q?: string } => ({
      q: typeof search.q === 'string' ? search.q : undefined,
    }),
    loader: () => allListings(),
    head: () => {
      const t = getDict(locale)
      return pageHead({
        title: t.search.title,
        description: t.search.metaDescription,
        path: localePath(locale, '/search'),
        image: '/og/default.png',
        locale,
      })
    },
    component: SearchPage,
  }
}

function SearchPage() {
  const apps = usePageData<Listing[]>()
  const { q } = usePageSearch<{ q?: string }>()
  const navigate = useNavigate()
  const t = useT()
  const query = q ?? ''
  const trimmed = query.trim()

  const filtered = useMemo(() => {
    const needle = trimmed.toLowerCase()
    if (!needle) return []
    return apps.filter((app) => {
      const haystack = [
        app.name,
        app.tagline,
        app.developer.name,
        categoryLabel(app.category, en),
        categoryLabel(app.category, ja),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [apps, trimmed])

  return (
    <div className="min-w-0">
      <h1 className="text-4xl/tight font-bold tracking-tight">{t.search.title}</h1>
      <label className="mt-6 flex items-center gap-3 rounded-md bg-surface px-4 py-3.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg">
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
              search: { q: next === '' ? undefined : next } as never,
              replace: true,
            })
          }}
          placeholder={t.search.placeholder}
          autoFocus
          aria-label={t.search.title}
          className="w-full min-w-0 bg-transparent text-lg outline-none placeholder:text-text-muted"
        />
      </label>
      {trimmed === '' ? (
        <p className="mt-4 text-text-muted">{t.search.empty}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-4 text-text-muted">{t.search.none(trimmed)}</p>
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
