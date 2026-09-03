import { createFileRoute } from '@tanstack/react-router'
import { newRoute } from '../pages/new'

export const Route = createFileRoute('/new')(newRoute('en'))
