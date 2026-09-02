import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'
import { pageHead } from '../lib/head'

export const Route = createFileRoute('/404')({
  head: () =>
    pageHead({
      title: 'Not found',
      description: 'This page is not in the Humation Apps catalog.',
      path: '/404',
    }),
  component: NotFoundPage,
})

function NotFoundPage() {
  return <NotFound />
}
