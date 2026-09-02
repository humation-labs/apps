import { NotFound } from '../components/NotFound'
import { getDict, localePath, type Locale } from '../i18n'
import { pageHead } from '../lib/head'

export function notFoundRoute(locale: Locale) {
  return {
    head: () => {
      const t = getDict(locale)
      return pageHead({
        title: t.notFound.title,
        description: t.notFound.metaDescription,
        path: localePath(locale, '/404'),
        locale,
      })
    },
    component: NotFound,
  }
}
