import { IconChevronRight } from '@tabler/icons-react'
import { notFound } from '@tanstack/react-router'
import { AppRowGrid } from '../components/AppRowGrid'
import { CategoryIcon } from '../components/CategoryIcon'
import { LocaleLink } from '../components/LocaleLink'
import { byCategory } from '../data/listings'
import type { Listing } from '../data/listings'
import { categoryLabel, getDict, localePath, useLocale, useT, type Locale } from '../i18n'
import { isCategory } from '../lib/constants'
import { pageHead } from '../lib/head'
import { usePageData } from './usePageData'

type CategoryData = {
  category: string
  apps: Listing[]
}

export function categoryRoute(locale: Locale) {
  return {
    loader: ({ params }: { params: { category: string } }): CategoryData => {
      if (!isCategory(params.category)) throw notFound()
      const apps = byCategory(params.category)
      return { category: params.category, apps }
    },
    head: ({ loaderData, params }: { loaderData?: CategoryData; params: { category: string } }) => {
      const t = getDict(locale)
      const category = loaderData?.category ?? params.category
      const title = categoryLabel(category, t)
      const count = loaderData?.apps.length ?? 0
      return pageHead({
        title,
        description: `${t.category.appsCount(count)} · ${title} · ${t.meta.siteName}`,
        path: localePath(locale, `/category/${category}`),
        image: '/og/default.png',
        locale,
      })
    },
    component: CategoryPage,
  }
}

function CategoryPage() {
  const { category, apps } = usePageData<CategoryData>()
  const locale = useLocale()
  const t = useT()
  const title = categoryLabel(category, t)

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
        <span className="text-text-muted">{title}</span>
      </nav>
      <h1 className="flex items-center gap-3 text-4xl/tight font-bold tracking-tight">
        <CategoryIcon category={category} size={20} className="icon-align" />
        {title}
      </h1>
      <p className="mt-1 text-text-muted tabular">{t.category.appsCount(apps.length)}</p>
      <div className="mt-4 min-w-0">
        <AppRowGrid apps={apps} />
      </div>
    </div>
  )
}
