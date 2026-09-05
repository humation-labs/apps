import { iconSrc } from '../lib/constants'
import { localePath, useLocale } from '../i18n'
import type { Listing } from '../data/listings'
import { LocaleLink } from './LocaleLink'
import { ShimmerImage } from './ShimmerImage'

export function AppCard({ app }: { app: Listing }) {
  const locale = useLocale()

  return (
    <LocaleLink
      href={localePath(locale, `/${app.slug}`)}
      className="flex gap-3 rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800"
    >
      <ShimmerImage src={iconSrc(app.slug)} alt="" width={64} height={64} wrapperClassName="size-16 shrink-0 rounded-[24%]" className="size-full rounded-[24%] border border-border/70 dark:border-white/15" />
      <div className="min-w-0">
        <h3 className="font-semibold">{app.name}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{app.tagline}</p>
      </div>
    </LocaleLink>
  )
}
