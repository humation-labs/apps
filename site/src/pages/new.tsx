import { IconChevronRight, IconSparkles } from '@tabler/icons-react'
import { AppRowGrid } from '../components/AppRowGrid'
import { LocaleLink } from '../components/LocaleLink'
import { newest } from '../data/listings'
import type { Listing } from '../data/listings'
import { getDict, localePath, useLocale, useT, type Locale } from '../i18n'
import { pageHead } from '../lib/head'
import { usePageData } from './usePageData'

type NewData = { apps: Listing[] }

export function newRoute(locale: Locale) {
  return {
    loader: (): NewData => ({ apps: newest() }),
    head: ({ loaderData }: { loaderData?: NewData }) => {
      const t = getDict(locale)
      const count = loaderData?.apps.length ?? 0
      return pageHead({
        title: t.home.new,
        description: `${t.category.appsCount(count)} · ${t.home.recentlyAdded} · ${t.meta.siteName}`,
        path: localePath(locale, '/new'),
        image: '/og/default.png',
        locale,
      })
    },
    component: NewPage,
  }
}

function NewPage() {
  const { apps } = usePageData<NewData>()
  const locale = useLocale()
  const t = useT()

  return (
    <div className="min-w-0">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm">
        <LocaleLink
          href={localePath(locale, '/')}
          className="hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {t.category.crumbApps}
        </LocaleLink>
        <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center text-text-muted">
          <IconChevronRight size={16} stroke={1.75} aria-hidden />
        </span>
        <span className="text-text-muted">{t.home.new}</span>
      </nav>
      <h1 className="flex items-center gap-3 text-4xl/tight font-bold tracking-tight">
        <span className="icon-align inline-flex size-10 shrink-0 items-center justify-center">
          <IconSparkles size={40} stroke={2} aria-hidden />
        </span>
        {t.home.new}
      </h1>
      <p className="mt-1 text-text-muted tabular">{t.category.appsCount(apps.length)}</p>
      <div className="mt-4 min-w-0">
        <AppRowGrid apps={apps} />
      </div>
    </div>
  )
}
