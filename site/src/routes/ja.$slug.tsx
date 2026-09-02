import { createFileRoute } from '@tanstack/react-router'
import { detailRoute } from '../pages/detail'

export const Route = createFileRoute('/ja/$slug')(detailRoute('ja'))
