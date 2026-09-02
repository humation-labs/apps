import { IconChevronRight } from '@tabler/icons-react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { AppRowGrid } from '../components/AppRowGrid'
import { CategoryIcon } from '../components/CategoryIcon'
import { isCategory } from '../lib/constants'
import { pageHead } from '../lib/head'
import { byCategory } from '../data/listings'
import {
  categoryLabel,
  getDict,
  langParam,
  localeFromLang,
  localePath,
  useLocale,
  useT,
} from '../i18n'

export const Route = createFileRoute('/{-$lang}/category/$category')({
  loader: ({ params }) => {
    if (!isCategory(params.category)) throw notFound()
    const apps = byCategory(params.category)
    return { category: params.category, apps }
  },
  head: ({ loaderData, params }) => {
    const locale = localeFromLang(params.lang)
    const t = getDict(locale)
    const category = loaderData?.category ?? params.category
    const title = categoryLabel(category, t)
    const count = loaderData?.apps.length ?? 0
    return pageHead({
      title,
      description: `${t.category.appsCount(count)} · ${title} · ${t.meta.siteName}`,
      path: localePath(`/category/${category}`, locale),
      locale,
    })
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category, apps } = Route.useLoaderData()
  const locale = useLocale()
  const t = useT()
  const lang = langParam(locale)
  const title = categoryLabel(category, t)

  return (
    <div className="min-w-0">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm">
        <Link
          to="/{-$lang}"
          params={{ lang }}
          className="hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {t.category.crumbApps}
        </Link>
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
        <AppRowGrid apps={apps} paged={false} />
      </div>
    </div>
  )
}
