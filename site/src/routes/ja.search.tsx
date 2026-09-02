import { createFileRoute } from '@tanstack/react-router'
import { searchRoute } from '../pages/search'

export const Route = createFileRoute('/ja/search')(searchRoute('ja'))
