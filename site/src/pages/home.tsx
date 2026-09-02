import { IconCheck } from '@tabler/icons-react'
import { CopyButton } from '../components/AddAppButton'
import { AppRowGrid } from '../components/AppRowGrid'
import { CategoryIcon } from '../components/CategoryIcon'
import { FeaturedCard, FeaturedCards } from '../components/FeaturedCards'
import { LocaleLink } from '../components/LocaleLink'
import { Section } from '../components/Section'
import { ClaudeLogo } from '../components/brand/ClaudeLogo'
import { GrokLogo } from '../components/brand/GrokLogo'
import { OpenAILogo } from '../components/brand/OpenAILogo'
import { byCategory, categoryCounts, featured, newest } from '../data/listings'
import type { Listing } from '../data/listings'
import { categoryLabel, getDict, localePath, useLocale, useT, type Locale } from '../i18n'
import { ADD_APP_PROMPT, CONTRIBUTING_URL } from '../lib/constants'
import { pageHead } from '../lib/head'
import { usePageData } from './usePageData'

type HomeData = {
  featured: Listing[]
  newest: Listing[]
  categories: { category: string; count: number; apps: Listing[] }[]
}

export function homeRoute(locale: Locale) {
  return {
    loader: (): HomeData => ({
      featured: featured(),
      newest: newest(18),
      categories: categoryCounts().map(({ category, count }) => ({
        category,
        count,
        apps: byCategory(category).slice(0, 9),
      })),
    }),
    head: () => {
      const t = getDict(locale)
      return pageHead({
        title: t.meta.siteName,
        description: t.home.metaDescription,
        path: localePath(locale, '/'),
        locale,
      })
    },
    component: Home,
  }
}

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

function Home() {
  const { featured: featuredApps, newest: newestApps, categories } = usePageData<HomeData>()
  const locale = useLocale()
  const t = useT()
  const hero = featuredApps[0]
  const previouslyFeatured = featuredApps.slice(1)

  return (
    <div className="min-w-0">
      <h1 className="text-4xl/tight font-bold tracking-tight">{t.home.title}</h1>

      {categories.length > 0 ? (
        <div className="no-scrollbar mt-6 flex snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain">
          {categories.map(({ category }) => (
            <LocaleLink
              key={category}
              href={localePath(locale, `/category/${category}`)}
              className="inline-flex h-8 shrink-0 snap-start items-center gap-2 rounded-full bg-surface-2 px-3 text-[13px] font-medium hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <CategoryIcon category={category} size={16} className="icon-align -ml-0.5" />
              {categoryLabel(category, t)}
            </LocaleLink>
          ))}
        </div>
      ) : null}

      {hero ? (
        <div className="mt-6 min-w-0">
          <FeaturedCards apps={[hero]} />
        </div>
      ) : null}

      <Section title={t.home.new} subtitle={t.home.recentlyAdded} href={localePath(locale, '/')}>
        {newestApps.length === 0 ? (
          <p className="text-text-muted">{t.home.noListings}</p>
        ) : (
          <AppRowGrid apps={newestApps} />
        )}
      </Section>

      {categories.map(({ category, apps }) => (
        <Section
          key={category}
          title={categoryLabel(category, t)}
          href={localePath(locale, `/category/${category}`)}
        >
          <AppRowGrid apps={apps} />
        </Section>
      ))}

      {previouslyFeatured.length > 0 ? (
        <section className="mt-12 min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">{t.home.featured}</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previouslyFeatured
              .filter((app) => app.screenshots[0])
              .map((app) => (
                <FeaturedCard key={app.slug} app={app} variant="compact" />
              ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12 rounded-xl bg-surface p-8 md:p-10" aria-label={t.shell.addYourApp}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t.home.ctaHeading}</h2>
            <p className="mt-2 max-w-[48ch] text-base text-text-muted">{t.home.ctaBody}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <CopyButton
              text={ADD_APP_PROMPT}
              label={t.home.copyPrompt}
              copiedMs={2500}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-base font-semibold text-white"
            >
              {(copied) =>
                copied ? (
                  <>
                    <span className="icon-align inline-flex size-4 shrink-0 items-center justify-center">
                      <IconCheck size={16} stroke={1.75} aria-hidden />
                    </span>
                    {t.home.copyPromptCopied}
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <ClaudeLogo size={16} className="opacity-90" />
                      <OpenAILogo size={16} />
                      <GrokLogo size={16} className="translate-x-px" />
                    </span>
                    {t.home.copyPrompt}
                  </>
                )
              }
            </CopyButton>
            <a
              href={CONTRIBUTING_URL}
              className={`text-sm text-text-muted underline-offset-4 hover:underline ${FOCUS}`}
            >
              {t.home.orReadContributing}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
