import { iconSrc, screenshotSrc } from '../lib/constants'
import { localePath, useLocale } from '../i18n'
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

  return (
    <LocaleLink
      href={localePath(locale, `/${app.slug}`)}
      className={`relative isolate block aspect-[3/4] w-full min-w-0 overflow-hidden rounded-xl transition hover:scale-[1.01] md:aspect-[21/9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        isPortrait
          ? ''
          : 'border border-border/70 dark:border-white/15 ring-1 ring-inset ring-black/10 dark:ring-white/10'
      }`}
    >
      {isPortrait ? (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: brand }} />
      ) : (
        <img
          src={src}
          alt={shot.alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full max-w-full object-cover object-top"
        />
      )}
      <span className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      {isPortrait ? null : (
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      )}
      {isPortrait ? (
        <div className="absolute top-[40%] right-4 bottom-[-16%] z-20 w-auto overflow-hidden rounded-xl border border-border/70 ring-1 ring-black/10 dark:border-white/15 md:top-[10%] md:right-10 md:bottom-[-24%] md:rounded-[1.5rem] lg:right-20">
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
      ) : null}
      {isPortrait ? (
        <div className="absolute inset-0 z-30 flex min-w-0 flex-col justify-start p-6 md:justify-center md:p-10 lg:p-14">
          <div className="flex min-w-0 flex-col gap-3 md:max-w-[50%]">
            <img
              src={iconSrc(app.slug)}
              alt=""
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="size-14 rounded-[22%] ring-1 ring-inset ring-white/20"
            />
            <h2
              className={`line-clamp-2 min-w-0 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl ${textClass}`}
            >
              {app.name}
            </h2>
            <p className={`text-lg md:text-xl ${mutedClass}`}>{app.tagline}</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-30 flex min-w-0 flex-col justify-end p-6 md:p-10 lg:p-14">
          <div className="flex min-w-0 flex-col gap-3 md:max-w-[50%]">
            <img
              src={iconSrc(app.slug)}
              alt=""
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="size-14 rounded-[22%] ring-1 ring-inset ring-white/20"
            />
            <h2 className="line-clamp-2 min-w-0 text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
              {app.name}
            </h2>
            <p className="text-lg text-white/75 md:text-xl">{app.tagline}</p>
          </div>
        </div>
      )}
    </LocaleLink>
  )
}
