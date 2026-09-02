import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'
import { getDict, localeFromLang, localePath } from '../i18n'
import { pageHead } from '../lib/head'

export const Route = createFileRoute('/{-$lang}/404')({
  head: ({ params }) => {
    const locale = localeFromLang(params.lang)
    const t = getDict(locale)
    return pageHead({
      title: t.notFound.title,
      description: t.notFound.metaDescription,
      path: localePath('/404', locale),
      locale,
    })
  },
  component: NotFoundPage,
})

function NotFoundPage() {
  return <NotFound />
}
