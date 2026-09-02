import { createFileRoute } from '@tanstack/react-router'
import { categoryRoute } from '../pages/category'

export const Route = createFileRoute('/ja/category/$category')(categoryRoute('ja'))
