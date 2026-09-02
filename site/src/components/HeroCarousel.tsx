import { IconChevronRight } from '@tabler/icons-react'
import { iconSrc, screenshotSrc } from '../lib/constants'
import { categoryLabel, localePath, useLocale, useT } from '../i18n'
import { iconColor, imageDimensions } from '../lib/images'
import type { Listing } from '../data/listings'
import { LocaleLink } from './LocaleLink'
import { PagerArrows, PagerDots } from './PagerControls'
import { useSnapScroll } from './useSnapScroll'

export function HeroCarousel({ apps }: { apps: Listing[] }) {
  const slides = apps.filter((app) => app.screenshots[0])
  const { ref, index, goTo, prev, next, onScroll, atStart, atEnd } = useSnapScroll(slides.length)
  const showControls = slides.length > 1

  if (slides.length === 0) return null

  return (
    <div className="min-w-0">
      <div className="relative min-w-0">
        <div
          ref={ref}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain touch-pan-x"
          role="region"
          aria-label="Featured apps"
        >
          {slides.map((app, slideIndex) => (
            <HeroCard key={app.slug} app={app} index={slideIndex} />
          ))}
        </div>
        {showControls ? (
          <PagerArrows onPrev={prev} onNext={next} showPrev={!atStart} showNext={!atEnd} />
        ) : null}
      </div>
      {showControls ? <PagerDots index={index} count={slides.length} onDot={goTo} /> : null}
    </div>
  )
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function HeroCard({ app, index }: { app: Listing; index: number }) {
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
  const pillClass = darkBg ? 'bg-white text-black' : 'bg-black text-white'

  return (
    <LocaleLink
      href={localePath(locale, `/${app.slug}`)}
      className={`relative isolate aspect-[4/5] w-full min-w-0 shrink-0 snap-center overflow-hidden rounded-xl md:aspect-[21/9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        isPortrait
          ? ''
          : 'border border-border/70 dark:border-white/15 ring-1 ring-inset ring-black/10 dark:ring-white/10'
      }`}
    >
      {isPortrait ? (
        <div
          className="absolute inset-0 z-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.18),transparent_60%)]"
          style={{ backgroundColor: brand }}
        />
      ) : (
        <img
          src={src}
          alt=""
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
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
      )}
      {isPortrait ? (
        <div className="absolute top-[38%] right-4 bottom-[-10%] z-20 w-auto overflow-hidden rounded-xl border border-border/70 ring-1 ring-black/10 dark:border-white/15 md:top-[14%] md:right-10 md:bottom-[-12%] md:rounded-[1.5rem] lg:right-16">
          <img
            src={src}
            alt=""
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
        <div className="absolute inset-0 z-30 flex min-w-0 flex-col justify-start p-6 md:justify-center md:p-10">
          <div className="flex min-w-0 max-w-[70%] flex-col md:max-w-[50%]">
            <div className="flex min-w-0 flex-col gap-3">
              <img
                src={iconSrc(app.slug)}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                className="size-14 rounded-[22%] ring-1 ring-inset ring-white/20"
              />
              <p
                className={`text-[11px] font-semibold tracking-[0.08em] uppercase ${mutedClass}`}
              >
                {categoryLabel(app.category, t)}
              </p>
              <h2
                className={`line-clamp-2 min-w-0 text-4xl font-bold leading-[1.05] tracking-tight lg:text-6xl ${textClass}`}
              >
                {app.name}
              </h2>
              <p className={`max-w-[36ch] text-base md:text-xl ${mutedClass}`}>{app.tagline}</p>
            </div>
            <span
              className={`mt-5 inline-flex h-10 shrink-0 items-center self-start rounded-full px-5 text-sm leading-none font-semibold ${pillClass}`}
            >
              {t.home.view}
              <IconChevronRight size={16} stroke={2.5} className="-mr-1" aria-hidden />
            </span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-30 flex min-w-0 flex-col justify-end p-6 md:p-10">
          <div className="flex min-w-0 flex-col md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 flex-col gap-3">
                <img
                  src={iconSrc(app.slug)}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="size-14 rounded-[22%] ring-1 ring-inset ring-white/20"
                />
                <p className="text-[11px] font-semibold tracking-[0.08em] text-white/70 uppercase">
                  {categoryLabel(app.category, t)}
                </p>
                <h2 className="line-clamp-2 min-w-0 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-4xl lg:text-6xl">
                  {app.name}
                </h2>
                <p className="max-w-[36ch] text-base text-white/85 md:text-xl">{app.tagline}</p>
              </div>
            </div>
            <span className="mt-4 inline-flex h-10 shrink-0 items-center self-start rounded-full bg-white px-5 text-sm leading-none font-semibold text-black md:mt-0 md:self-end">
              {t.home.view}
              <IconChevronRight size={16} stroke={2.5} className="-mr-1" aria-hidden />
            </span>
          </div>
        </div>
      )}
    </LocaleLink>
  )
}
