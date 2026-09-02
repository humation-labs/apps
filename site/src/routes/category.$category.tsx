import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { AppCard } from '../components/AppCard'
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        <Link to="/" className="text-blue-600">
          Apps
        </Link>{' '}
        / {title}
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-6 mt-1 text-zinc-600 dark:text-zinc-400">{countLabel}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  )
}
