import { iconSrc } from '../lib/constants'
import { localePath, useLocale, useT } from '../i18n'
import type { Listing } from '../data/listings'
import { LocaleLink } from './LocaleLink'
import { ShimmerImage } from './ShimmerImage'

export function AppRow({ app }: { app: Listing }) {
  const locale = useLocale()
  const t = useT()

  return (
    <LocaleLink
      href={localePath(locale, `/${app.slug}`)}
      className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-2 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <ShimmerImage
        src={iconSrc(app.slug)}
        alt=""
        width={64}
        height={64}
        wrapperClassName="size-16 shrink-0 rounded-[24%]"
        className="size-full rounded-[24%] border border-border/70 dark:border-white/15"
      />
      <div className="min-w-0 flex-1 self-center">
        <p className="truncate text-[14px]/5 font-medium">{app.name}</p>
        <p className="truncate text-[13px]/[18px] text-text-muted">{app.tagline}</p>
      </div>
      <span className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-surface-2 px-3.5 text-[13px] leading-none font-semibold text-accent">
        {t.home.view}
      </span>
    </LocaleLink>
  )
}
