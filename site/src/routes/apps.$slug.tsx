import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
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
import { PagerArrows } from '../components/PagerControls'
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
      <header className="flex flex-col gap-5 md:flex-row md:items-start">
        <img
          src={iconSrc(listing.slug)}
          alt={listing.name}
          width={120}
          height={120}
          className="size-[120px] shrink-0 rounded-[22%] border border-border"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold md:text-4xl">{listing.name}</h1>
          <p className="mt-1 text-lg text-text-muted">{listing.tagline}</p>
          <a href={developerUrl} rel="noopener" className="mt-2 inline-block text-accent">
            {listing.developer.name}
          </a>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <a
            href={listing.url}
            rel="noopener"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <IconExternalLink size={16} aria-hidden />
            Open
          </a>
          <div className="flex flex-wrap gap-1.5 md:justify-end">
            {listing.platforms.map((platform) => (
              <span key={platform} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs">
                {platformLabel(platform)}
              </span>
            ))}
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs">
              {PRICING_LABELS[listing.pricing]}
            </span>
          </div>
        </div>
      </header>

      <div className="mt-8 min-w-0">
        <ScreenshotGallery shots={screenshots} />
      </div>

      <Description text={listing.description} />

      <section className="mt-10 min-w-0">
        <h2 className="text-xl font-bold">Information</h2>
        <dl className="mt-3">
          <InfoRow label="Developer">
            <a href={developerUrl} rel="noopener" className="text-accent">
              {listing.developer.name}
            </a>
          </InfoRow>
          <InfoRow label="Category">
            <Link
              to="/category/$category"
              params={{ category: listing.category }}
              className="text-accent"
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
                  className="rounded-full bg-surface-2 px-3 py-1 text-sm"
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
                    className="inline-flex items-center gap-1.5 text-accent"
                  >
                    <Icon size={16} aria-hidden />
                    {label}
                  </a>
                ))}
              </div>
            </InfoRow>
          ) : null}
          <InfoRow label="Added">{formatAdded(listing.addedAt)}</InfoRow>
        </dl>
      </section>

      <div className="mt-10 rounded-2xl bg-surface p-6">
        <p>Link back to your listing from your site:</p>
        <div className="mt-3 flex min-w-0 items-start gap-2">
          <code className="block min-w-0 flex-1 whitespace-pre-wrap break-all rounded-lg bg-surface-2 p-3 text-sm">
            {snippet}
          </code>
          <CopyButton
            text={snippet}
            label="Copy"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
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
    <div className="flex items-start gap-4 border-b border-border py-3 last:border-b-0">
      <dt className="w-40 shrink-0 text-text-muted">{label}</dt>
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  )
}

function Description({ text }: { text: string }) {
  const paragraphs = descriptionParagraphs(text)
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 400
  const clamp = isLong && !expanded

  return (
    <section className="mt-10 min-w-0">
      <h2 className="text-xl font-bold">Description</h2>
      <div
        className={`mt-3 space-y-4 text-base leading-relaxed ${clamp ? 'line-clamp-6' : ''}`}
      >
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {clamp ? (
        <button
          type="button"
          className="mt-2 rounded-sm text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          onClick={() => setExpanded(true)}
          aria-label="Show more"
        >
          more
        </button>
      ) : null}
    </section>
  )
}

function ScreenshotGallery({
  shots,
}: {
  shots: { file: string; src: string; alt: string; width: number; height: number }[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    setOverflows(el.scrollWidth > el.clientWidth + 1)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure, shots.length])

  function scroll(direction: -1 | 1) {
    const el = ref.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    const left = el.scrollLeft
    const target =
      direction > 0
        ? children.find((child) => child.offsetLeft > left + 4)
        : [...children].reverse().find((child) => child.offsetLeft < left - 4)
    if (target) {
      el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
    }
  }

  if (shots.length === 0) return null

  return (
    <div className="relative min-w-0">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
        role="region"
        aria-label="Screenshots"
      >
        {shots.map((shot, i) => {
          const landscape = shot.width >= shot.height
          return (
            <img
              key={shot.file}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              className={`h-auto shrink-0 snap-start rounded-xl border border-border ${
                landscape ? 'w-[640px] max-w-[85vw]' : 'w-[280px] max-w-full'
              }`}
            />
          )
        })}
      </div>
      {overflows ? (
        <PagerArrows onPrev={() => scroll(-1)} onNext={() => scroll(1)} />
      ) : null}
    </div>
  )
}
