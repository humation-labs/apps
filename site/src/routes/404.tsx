import { createFileRoute } from '@tanstack/react-router'
import { notFoundRoute } from '../pages/notFound'

export const Route = createFileRoute('/404')(notFoundRoute('en'))
