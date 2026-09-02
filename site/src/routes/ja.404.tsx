import { createFileRoute } from '@tanstack/react-router'
import { notFoundRoute } from '../pages/notFound'

export const Route = createFileRoute('/ja/404')(notFoundRoute('ja'))
