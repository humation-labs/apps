import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    scrollToTopSelectors: ['body'],
    defaultPreload: 'intent',
  })

  return router
}
