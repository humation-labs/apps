import { canonicalUrl, SITE_NAME, SITE_ORIGIN } from './constants'

export function pageHead({
  title,
  description,
  path,
  image = '/favicon.png',
}: {
  title: string
  description: string
  path: string
  image?: string
}) {
  const canonical = canonicalUrl(path)
  const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`
  const ogImage = new URL(image, SITE_ORIGIN).href

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}
