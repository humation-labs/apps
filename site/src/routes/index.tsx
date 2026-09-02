import { createFileRoute } from '@tanstack/react-router'
import { homeRoute } from '../pages/home'

export const Route = createFileRoute('/')(homeRoute('en'))
