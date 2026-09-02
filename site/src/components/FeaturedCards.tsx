import { iconSrc, screenshotSrc } from '../lib/constants'
import { categoryLabel, localePath, useLocale, useT } from '../i18n'
import { iconColor, imageDimensions } from '../lib/images'
import type { Listing } from '../data/listings'
import { LocaleLink } from './LocaleLink'

export function FeaturedCards({ apps }: { apps: Listing[] }) {
  const cards = apps.filter((app) => app.screenshots[0]).slice(0, 2)
  if (cards.length === 0) return null

  return (
    <div className="space-y-6">
      {cards.map((app, index) => (
        <FeaturedCard key={app.slug} app={app} index={index} />
      ))}
    </div>
  )
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function FeaturedCard({ app, index }: { app: Listing; index: number }) {
  const locale = useLocale()
  const t = useT()
  const shot = app.screenshots[0]
  const { width, height } = imageDimensions(app.slug, shot.file)
  const isPortrait = height > width
  const src = screenshotSrc(app.slug, shot.file)
  const isLcp = index === 0
  const loading = isLcp ? 'eager' : 'lazy'
  const fetchPriority = isLcp ? 'high' : undefined
  const brand = iconColor(app.slug)
  const darkBg = relativeLuminance(brand) < 0.5
  const textClass = darkBg ? 'text-white' : 'text-black'
  const mutedClass = darkBg ? 'text-white/75' : 'text-black/75'
  const promoMutedClass = darkBg ? 'text-white/80' : 'text-black/80'
  const category = categoryLabel(app.category, t)

  return (
    <LocaleLink
      href={localePath(locale, `/${app.slug}`)}
      className="block w-full min-w-0 overflow-hidden rounded-xl transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <div className={textClass} style={{ backgroundColor: brand }}>
        <div className="relative aspect-[3/4] overflow-hidden md:aspect-[21/9]">
          {isPortrait ? (
            <div className="absolute top-6 right-6 bottom-[-22%] overflow-hidden rounded-[1.25rem] border border-border/70 ring-1 ring-black/10 dark:border-white/15 md:top-8 md:right-16 md:bottom-[-30%] lg:right-24">
              <img
                src={src}
                alt={shot.alt}
                width={width}
                height={height}
                loading={loading}
                fetchPriority={fetchPriority}
                decoding="async"
                className="h-full w-auto object-contain object-top"
              />
            </div>
          ) : (
            <img
              src={src}
              alt={shot.alt}
              width={width}
              height={height}
              loading={loading}
              fetchPriority={fetchPriority}
              decoding="async"
              className="absolute inset-0 h-full w-full max-w-full object-cover object-top"
            />
          )}
          {isPortrait ? (
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t to-transparent ${
                darkBg ? 'from-black/55' : 'from-white/55'
              }`}
            />
          ) : (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          )}
          <div
            className={`absolute inset-x-0 bottom-0 flex max-w-[68%] flex-col justify-end p-6 md:max-w-[55%] md:p-10 ${
              isPortrait ? '' : 'text-white'
            }`}
          >
            <p
              className={`text-[11px] uppercase tracking-[0.08em] ${
                isPortrait ? mutedClass : 'text-white/75'
              }`}
            >
              {category}
            </p>
            <h2 className="line-clamp-2 min-w-0 text-3xl font-bold leading-[1.02] tracking-tight md:text-5xl lg:text-6xl">
              {app.name}
            </h2>
            <p
              className={`mt-2 line-clamp-2 text-base md:text-lg ${
                isPortrait ? promoMutedClass : 'text-white/80'
              }`}
            >
              {app.tagline}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-3 px-5 py-4 md:px-8 md:py-5 ${
            darkBg ? 'bg-black/15' : 'bg-white/25'
          }`}
        >
          <img
            src={iconSrc(app.slug)}
            alt=""
            width={48}
            height={48}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            className="size-12 shrink-0 rounded-[22%] ring-1 ring-inset ring-white/20"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold">{app.name}</p>
            <p className={`truncate text-[13px] ${mutedClass}`}>{app.tagline}</p>
          </div>
          <span
            className={`inline-flex h-8 shrink-0 items-center rounded-full px-4 text-sm font-semibold leading-none backdrop-blur ${
              darkBg ? 'bg-white/20' : 'bg-black/10'
            }`}
          >
            {t.home.view}
          </span>
        </div>
      </div>
    </LocaleLink>
  )
}
