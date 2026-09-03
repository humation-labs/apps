import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { IS_GATAG, pageview } from '../lib/gtag'

export function GoogleAnalytics() {
  const router = useRouter()

  useEffect(() => {
    if (!IS_GATAG) return
    // onResolved can also fire for the initial load; dedupe by URL so the first page_view is not sent twice.
    let lastUrl = ''
    const track = (url: string) => {
      if (url === lastUrl) return
      lastUrl = url
      pageview(url)
    }
    track(window.location.pathname + window.location.search)
    return router.subscribe('onResolved', ({ toLocation }) => {
      track(toLocation.href)
    })
  }, [router])

  return null
}
