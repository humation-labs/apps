import { useState, type ReactNode } from 'react'
import {
  IconArrowUpRight,
  IconBrandApple,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGooglePlay,
  IconBrandX,
  IconCheck,
  IconLink,
} from '@tabler/icons-react'
import { notFound } from '@tanstack/react-router'
import { CopyButton } from '../components/AddAppButton'
import { AppRowGrid } from '../components/AppRowGrid'
import { LocaleLink } from '../components/LocaleLink'
import { ScreenshotGallery } from '../components/ScreenshotGallery'
import { Section } from '../components/Section'
import { byCategory, bySlug } from '../data/listings'
import type { Listing } from '../data/listings'
import {
  categoryLabel,
  formatDate,
  getDict,
  localePath,
  platformLabel,
  pricingLabel,
  useLocale,
  useT,
  type Locale,
} from '../i18n'
import {
  SITE_ORIGIN,
  descriptionParagraphs,
  developerHref,
  iconSrc,
  packageHref,
  screenshotSrc,
} from '../lib/constants'
import { pageHead } from '../lib/head'
import { imageDimensions } from '../lib/images'
import { usePageData } from './usePageData'

type Screenshot = Listing['screenshots'][number] & {
  src: string
  width: number
  height: number
}

type DetailData = {
  listing: Listing
  screenshots: Screenshot[]
}

export function detailRoute(locale: Locale) {
  return {
    loader: ({ params }: { params: { slug: string } }): DetailData => {
      const listing = bySlug(params.slug)
      if (!listing) throw notFound()
      const screenshots = listing.screenshots.map((shot) => ({
        ...shot,
        src: screenshotSrc(listing.slug, shot.file),
        ...imageDimensions(listing.slug, shot.file),
      }))
      return { listing, screenshots }
    },
    head: ({ loaderData }: { loaderData?: DetailData }) => {
      const t = getDict(locale)
      if (!loaderData) {
        return pageHead({
          title: t.notFound.title,
          description: t.notFound.metaDescription,
          path: localePath(locale, '/404'),
          image: '/og/default.png',
          locale,
        })
      }
      const { listing } = loaderData
      return pageHead({
        title: listing.name,
        description: listing.tagline,
        path: localePath(locale, `/${listing.slug}`),
        image: `/og/${listing.slug}.png`,
        locale,
      })
    },
    component: AppDetail,
  }
}

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
  const { listing, screenshots } = usePageData<DetailData>()
  const locale = useLocale()
  const t = useT()
  const developerUrl = developerHref(listing.developer)
  const moreInCategory = byCategory(listing.category)
    .filter((app) => app.slug !== listing.slug)
    .slice(0, 9)
  const snippet = `<a href="${SITE_ORIGIN}/${listing.slug}">${t.detail.featuredOn}</a>`
  const presentLinks = LINK_DEFS.filter((def) => listing.links?.[def.key])
  const category = categoryLabel(listing.category, t)

  return (
    <article className="min-w-0">
      <header className="flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="flex items-center gap-5 md:gap-8 md:contents">
          <img
            src={iconSrc(listing.slug)}
            alt={listing.name}
            width={120}
            height={120}
            className="size-24 shrink-0 rounded-[22%] ring-1 ring-inset ring-black/10 md:size-[120px] dark:ring-white/10"
          />
          <div className="min-w-0 flex-1 space-y-0.5 leading-snug">
            <h1 className="text-xl font-bold tracking-tight md:text-4xl/tight">{listing.name}</h1>
            <p className="text-sm text-text-muted md:text-lg">{listing.tagline}</p>
            <a href={developerUrl} rel="noopener" className={`inline-block text-sm text-accent ${FOCUS}`}>
              {listing.developer.name}
            </a>
          </div>
        </div>
        <a
          href={listing.url}
          rel="noopener"
          target="_blank"
          className={`mt-5 inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base leading-none font-semibold text-white transition hover:brightness-110 active:scale-[0.98] md:mt-0 md:w-auto ${FOCUS}`}
        >
          {t.detail.open}
          <span className="icon-align -mr-1 inline-flex size-5 shrink-0 items-center justify-center">
            <IconArrowUpRight size={20} stroke={2} aria-hidden />
          </span>
        </a>
      </header>

      <div className="mt-8 min-w-0">
        <ScreenshotGallery key={listing.slug} shots={screenshots} />
      </div>

      <Description text={listing.description} />

      <section className="mt-8 min-w-0">
        <h2 className="text-xl font-semibold tracking-tight">{t.detail.information}</h2>
        <dl className="mt-4">
          <InfoRow label={t.detail.developer}>
            <a href={developerUrl} rel="noopener" className={`text-accent ${FOCUS}`}>
              {listing.developer.name}
            </a>
          </InfoRow>
          <InfoRow label={t.detail.category}>
            <LocaleLink
              href={localePath(locale, `/category/${listing.category}`)}
              className={`text-accent ${FOCUS}`}
            >
              {category}
            </LocaleLink>
          </InfoRow>
          <InfoRow label={t.detail.platforms}>
            {listing.platforms.map((platform) => platformLabel(platform, t)).join(', ')}
          </InfoRow>
          <InfoRow label={t.detail.pricing}>{pricingLabel(listing.pricing, t)}</InfoRow>
          <InfoRow label={t.detail.builtWith}>
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
            <InfoRow label={t.detail.whereAvatarsAppear}>{listing.humation.usage}</InfoRow>
          ) : null}
          {presentLinks.length > 0 ? (
            <InfoRow label={t.detail.links}>
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
          <InfoRow label={t.detail.added}>
            <span className="tabular">{formatDate(listing.addedAt, locale)}</span>
          </InfoRow>
        </dl>
      </section>

      <div className="mt-8 rounded-xl bg-surface p-6 md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{t.detail.linkBack}</h2>
            <p className="mt-1 text-sm text-text-muted">{t.detail.linkBackBody}</p>
          </div>
          <div className="flex w-full flex-col items-center gap-3 self-center justify-self-end md:w-auto">
            <CopyButton
              text={snippet}
              label={t.detail.copyLinkTag}
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-surface-2 px-5 text-sm font-semibold hover:bg-surface-3 md:w-auto"
            >
              {(copied) => (
                <>
                  <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">
                    {copied ? (
                      <IconCheck size={16} stroke={1.75} aria-hidden />
                    ) : (
                      <IconLink size={16} stroke={1.75} aria-hidden />
                    )}
                  </span>
                  {copied ? t.shell.copied : t.detail.copyLinkTag}
                </>
              )}
            </CopyButton>
          </div>
        </div>
      </div>

      {moreInCategory.length > 0 ? (
        <Section
          title={t.detail.moreIn(category)}
          href={localePath(locale, `/category/${listing.category}`)}
        >
          <AppRowGrid apps={moreInCategory} />
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
  const t = useT()
  const paragraphs = descriptionParagraphs(text)
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > 400
  const clamp = isLong && !expanded

  return (
    <section className="mt-8 min-w-0">
      <h2 className="text-xl font-semibold tracking-tight">{t.detail.description}</h2>
      <div className={`mt-4 space-y-4 text-base leading-relaxed ${clamp ? 'line-clamp-6' : ''}`}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {isLong ? (
        <button
          type="button"
          className={`mt-2 rounded-sm text-accent ${FOCUS}`}
          onClick={() => setExpanded((current) => !current)}
          aria-label={expanded ? t.detail.less : t.detail.more}
        >
          {expanded ? t.detail.less : t.detail.more}
        </button>
      ) : null}
    </section>
  )
}
