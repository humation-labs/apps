import { useState, type ReactNode } from 'react'
import {
  IconBrandApple,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGooglePlay,
  IconBrandX,
  IconExternalLink,
} from '@tabler/icons-react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { CopyButton } from '../components/AddAppButton'
import { AppRowGrid } from '../components/AppRowGrid'
import { ScreenshotGallery } from '../components/ScreenshotGallery'
import { Section } from '../components/Section'
import {
  PRICING_LABELS,
  SITE_ORIGIN,
  categoryLabel,
  descriptionParagraphs,
  developerHref,
  formatAdded,
  iconSrc,
  packageHref,
  platformLabel,
  screenshotSrc,
} from '../lib/constants'
import { pageHead } from '../lib/head'
import { imageDimensions } from '../lib/images'
import { byCategory, bySlug } from '../data/listings'

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

const LINK_DEFS = [
  { key: 'repo', label: 'GitHub', Icon: IconBrandGithub },
  { key: 'appStore', label: 'App Store', Icon: IconBrandApple },
  { key: 'playStore', label: 'Play Store', Icon: IconBrandGooglePlay },
  { key: 'x', label: 'X', Icon: IconBrandX },
  { key: 'discord', label: 'Discord', Icon: IconBrandDiscord },
] as const

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

function AppDetail() {
  const { listing, screenshots } = Route.useLoaderData()
  const developerUrl = developerHref(listing.developer)
  const moreInCategory = byCategory(listing.category)
    .filter((app) => app.slug !== listing.slug)
    .slice(0, 9)
  const snippet = `<a href="${SITE_ORIGIN}/apps/${listing.slug}">Featured on apps.humation.app</a>`
  const presentLinks = LINK_DEFS.filter((def) => listing.links?.[def.key])

  return (
    <article className="min-w-0">
      <header className="flex flex-col md:flex-row md:items-center md:gap-5">
        <img
          src={iconSrc(listing.slug)}
          alt={listing.name}
          width={120}
          height={120}
          className="size-[120px] shrink-0 rounded-[22%] ring-1 ring-inset ring-black/10 dark:ring-white/10"
        />
        <div className="mt-5 min-w-0 flex-1 md:mt-0">
          <h1 className="text-4xl/tight font-bold tracking-tight">{listing.name}</h1>
          <p className="mt-1 text-lg text-text-muted">{listing.tagline}</p>
          <a href={developerUrl} rel="noopener" className={`mt-2 inline-block text-accent ${FOCUS}`}>
            {listing.developer.name}
          </a>
        </div>
        <a
          href={listing.url}
          rel="noopener"
          target="_blank"
          className={`mt-5 inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base leading-none font-semibold text-white shadow-[0_8px_24px_-8px_var(--accent)] transition hover:brightness-110 active:scale-[0.98] md:mt-0 md:w-auto ${FOCUS}`}
        >
          <span className="icon-align -ml-0.5 inline-flex size-5 shrink-0 items-center justify-center">
            <IconExternalLink size={20} stroke={2} aria-hidden />
          </span>
          Open
        </a>
      </header>

      <div className="mt-8 min-w-0">
        <ScreenshotGallery shots={screenshots} />
      </div>

      <Description text={listing.description} />

      <section className="mt-8 min-w-0">
        <h2 className="text-xl font-semibold tracking-tight">Information</h2>
        <dl className="mt-4">
          <InfoRow label="Developer">
            <a href={developerUrl} rel="noopener" className={`text-accent ${FOCUS}`}>
              {listing.developer.name}
            </a>
          </InfoRow>
          <InfoRow label="Category">
            <Link
              to="/category/$category"
              params={{ category: listing.category }}
              className={`text-accent ${FOCUS}`}
            >
              {categoryLabel(listing.category)}
            </Link>
          </InfoRow>
          <InfoRow label="Platforms">{listing.platforms.map(platformLabel).join(', ')}</InfoRow>
          <InfoRow label="Pricing">{PRICING_LABELS[listing.pricing]}</InfoRow>
          <InfoRow label="Built with">
            <div className="flex flex-wrap gap-2">
              {listing.humation.packages.map((pkg) => (
                <a
                  key={pkg}
                  href={packageHref(pkg)}
                  rel="noopener"
                  className={`inline-flex h-7 items-center justify-center rounded-full bg-surface-2 px-3.5 text-[13px] leading-none font-medium ${FOCUS}`}
                >
                  {pkg}
                </a>
              ))}
            </div>
          </InfoRow>
          {listing.humation.usage ? (
            <InfoRow label="Where avatars appear">{listing.humation.usage}</InfoRow>
          ) : null}
          {presentLinks.length > 0 ? (
            <InfoRow label="Links">
              <div className="flex flex-wrap gap-3">
                {presentLinks.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={listing.links?.[key]}
                    rel="noopener"
                    target="_blank"
                    className={`inline-flex items-center gap-1.5 text-accent ${FOCUS}`}
                  >
                    <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">
                      <Icon size={16} stroke={1.75} aria-hidden />
                    </span>
                    {label}
                  </a>
                ))}
              </div>
            </InfoRow>
          ) : null}
          <InfoRow label="Added">
            <span className="tabular">{formatAdded(listing.addedAt)}</span>
          </InfoRow>
        </dl>
      </section>

      <div className="mt-8 rounded-xl bg-surface p-6">
        <h2 className="text-xl font-semibold tracking-tight">Link back to your listing from your site:</h2>
        <div className="mt-4 flex min-w-0 items-start gap-2">
          <code className="block min-w-0 flex-1 font-mono text-[13px] leading-relaxed break-words rounded-sm bg-surface-2 p-3">
            {snippet}
          </code>
          <CopyButton
            text={snippet}
            label="Copy"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-[14px] leading-none font-semibold text-white"
          />
        </div>
      </div>

      {moreInCategory.length > 0 ? (
        <Section
          title={`More in ${categoryLabel(listing.category)}`}
          to="/category/$category"
          params={{ category: listing.category }}
        >
          <AppRowGrid apps={moreInCategory} paged={false} />
        </Section>
      ) : null}
    </article>
  )
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 border-b border-border/60 py-3 last:border-b-0">
      <dt className="w-44 shrink-0 text-[14px] text-text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-[14px]">{children}</dd>
    </div>
  )
}

function Description({ text }: { text: string }) {
  const paragraphs = descriptionParagraphs(text)
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 400
  const clamp = isLong && !expanded

  return (
    <section className="mt-8 min-w-0">
      <h2 className="text-xl font-semibold tracking-tight">Description</h2>
      <div
        className={`mt-4 space-y-4 text-base leading-relaxed ${clamp ? 'line-clamp-6' : ''}`}
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {clamp ? (
        <button
          type="button"
          className={`mt-2 rounded-sm text-accent ${FOCUS}`}
          onClick={() => setExpanded(true)}
          aria-label="Show more"
        >
          more
        </button>
      ) : null}
    </section>
  )
}
