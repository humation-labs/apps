import { IconChevronRight } from '@tabler/icons-react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { AppRowGrid } from '../components/AppRowGrid'
import { CategoryIcon } from '../components/CategoryIcon'
import { CATEGORY_LABELS, categoryLabel } from '../lib/constants'
import { pageHead } from '../lib/head'
import { byCategory } from '../data/listings'

export const Route = createFileRoute('/category/$category')({
  loader: ({ params }) => {
    if (!(params.category in CATEGORY_LABELS)) throw notFound()
    const apps = byCategory(params.category)
    return { category: params.category, apps }
  },
  head: ({ loaderData, params }) => {
    const category = loaderData?.category ?? params.category
    const title = categoryLabel(category)
    const count = loaderData?.apps.length ?? 0
    const countLabel = `${count} ${count === 1 ? 'app' : 'apps'}`
    return pageHead({
      title,
      description: `${countLabel} in ${title} on Humation Apps.`,
      path: `/category/${category}`,
    })
  },
  component: CategoryPage,
})

function CategoryPage() {
  const { category, apps } = Route.useLoaderData()
  const title = categoryLabel(category)
  const countLabel = `${apps.length} ${apps.length === 1 ? 'app' : 'apps'}`

  return (
    <div className="min-w-0">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm">
        <Link to="/" className="hover:text-accent">
          Apps
        </Link>
        <IconChevronRight size={16} className="text-text-muted" aria-hidden />
        <span className="text-text-muted">{title}</span>
      </nav>
      <h1 className="flex items-center gap-3 text-3xl font-bold">
        <CategoryIcon category={category} size={32} />
        {title}
      </h1>
      <p className="mt-1 text-text-muted">{countLabel}</p>
      <div className="mt-6 min-w-0">
        <AppRowGrid apps={apps} paged={false} />
      </div>
    </div>
  )
}
