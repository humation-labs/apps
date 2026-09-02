import { type Locale, getDict, localePath } from '../i18n'
import { canonicalUrl, SITE_ORIGIN } from './constants'

function stripLocalePrefix(path: string): string {
  if (path === '/ja') return '/'
  if (path.startsWith('/ja/')) return path.slice(3)
  return path
}

export function pageHead({
  title,
  description,
  path,
  image = '/favicon.png',
  locale,
}: {
  title: string
  description: string
  path: string
  image?: string
  locale: Locale
}) {
  const canonical = canonicalUrl(path)
  const siteName = getDict(locale).meta.siteName
  const fullTitle = title === siteName ? title : `${title} · ${siteName}`
  const ogImage = new URL(image, SITE_ORIGIN).href
  const bare = stripLocalePrefix(path)
  const enUrl = canonicalUrl(localePath(bare, 'en'))
  const jaUrl = canonicalUrl(localePath(bare, 'ja'))

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { property: 'og:locale', content: locale === 'ja' ? 'ja_JP' : 'en_US' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'canonical', href: canonical },
      { rel: 'alternate', hreflang: 'en', href: enUrl },
      { rel: 'alternate', hreflang: 'ja', href: jaUrl },
      { rel: 'alternate', hreflang: 'x-default', href: enUrl },
    ],
  }
}
