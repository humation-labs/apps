// gtag.js itself is loaded and configured from the root route head (see routes/__root.tsx)
export const GA_TAG_ID: string = import.meta.env.VITE_GA_ID || ''

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/

export const IS_GATAG = GA_ID_PATTERN.test(GA_TAG_ID)

if (GA_TAG_ID !== '' && !IS_GATAG) {
  console.warn(
    `[gtag] VITE_GA_ID "${GA_TAG_ID}" is not a GA4 measurement ID (expected G-XXXXXXXXXX); analytics disabled`,
  )
}

type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: GtagFn
    dataLayer?: unknown[]
  }
}

/** Inline bootstrap that runs before the async gtag.js script. page_view is sent by the router, so the automatic one is disabled. */
export const GA_INIT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_TAG_ID}',{send_page_view:false});`

export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_TAG_ID}`

function getGtag(): GtagFn | null {
  if (!IS_GATAG || typeof window === 'undefined') return null
  return typeof window.gtag === 'function' ? window.gtag : null
}

export function pageview(path: string): void {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', 'page_view', {
    page_path: path,
    page_location: new URL(path, window.location.origin).toString(),
    page_title: document.title,
    transport_type: 'beacon',
  })
}

export function event(action: string, params?: Record<string, string | number | boolean>): void {
  const gtag = getGtag()
  if (!gtag) return
  gtag('event', action, { transport_type: 'beacon', ...params })
}
