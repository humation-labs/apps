import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  descriptionParagraphs,
  developerHref,
  formatAdded,
  iconSrc,
  packageHref,
  screenshotSrc,
} from '../lib/constants'
import { pageHead } from '../lib/head'
import { imageDimensions } from '../lib/images'
import { bySlug } from '../data/listings'

export const Route = createFileRoute('/apps/$slug')({
  loader: ({ params }) => {
    const listing = bySlug(params.slug)
    if (!listing) throw notFound()
    const screenshots = listing.screenshots.map((shot) => ({
      ...shot,
      src: screenshotSrc(listing.slug, shot.file),
      ...imageDimensions(listing.slug, shot.file),
    }))
    return { listing, screenshots }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return pageHead({
        title: 'Not found',
        description: 'This page is not in the Humation Apps catalog.',
        path: '/404',
      })
    }
    const { listing } = loaderData
    return pageHead({
      title: listing.name,
      description: listing.tagline,
      path: `/apps/${listing.slug}`,
      image: iconSrc(listing.slug),
    })
  },
  component: AppDetail,
})

function AppDetail() {
  const { listing, screenshots } = Route.useLoaderData()
  const paragraphs = descriptionParagraphs(listing.description)
  const developerUrl = developerHref(listing.developer)

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-start gap-4">
        <img
          src={iconSrc(listing.slug)}
          alt=""
          width={118}
          height={118}
          className="size-[118px] rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{listing.name}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{listing.tagline}</p>
          <p className="mt-1">
            <a href={developerUrl} rel="noopener" className="text-blue-600">
              {listing.developer.name}
            </a>
          </p>
        </div>
        <a
          href={listing.url}
          rel="noopener"
          target="_blank"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Open
        </a>
      </header>

      <div className="mb-8 flex gap-3 overflow-x-auto" role="region" aria-label="Screenshots">
        {screenshots.map((shot) => (
          <figure key={shot.file} className="m-0 shrink-0">
            <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} className="h-80 w-auto rounded-xl" />
          </figure>
        ))}
      </div>

      <section aria-label="Description" className="mb-8 max-w-2xl space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section aria-labelledby="built-with-heading" className="mb-8">
        <h2 id="built-with-heading" className="mb-3 text-xl font-bold">
          Built with
        </h2>
        <div className="flex flex-wrap gap-2">
          {listing.humation.packages.map((pkg) => (
            <a
              key={pkg}
              href={packageHref(pkg)}
              rel="noopener"
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm font-semibold dark:border-zinc-800"
            >
              {pkg}
            </a>
          ))}
        </div>
        {listing.humation.usage ? (
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">{listing.humation.usage}</p>
        ) : null}
      </section>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">Added {formatAdded(listing.addedAt)}</p>

      <p className="mt-6">
        <Link to="/" className="text-blue-600">
          Back to Apps
        </Link>
      </p>
    </article>
  )
}
