import { useLocation, useRouterState } from '@tanstack/react-router'
import type { Category, Platform, Pricing } from '../lib/constants'
import { en } from './en'
import { ja } from './ja'

export type Locale = 'en' | 'ja'
export type Dict = typeof en

export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/ja' || pathname.startsWith('/ja/') ? 'ja' : 'en'
}

export function useLocale(): Locale {
  const { pathname } = useLocation()
  return localeFromPathname(pathname)
}

export function getDict(locale: Locale): Dict {
  return locale === 'ja' ? ja : en
}

export function useT(): Dict {
  return getDict(useLocale())
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ja' ? 'en' : 'ja'
}

export function localePath(locale: Locale, path: string): string {
  if (locale === 'en') return path
  return path === '/' ? '/ja' : `/ja${path}`
}

export function otherLocalePath(locale: Locale, pathname: string, search = ''): string {
  const target = otherLocale(locale)
  const bare =
    pathname === '/ja' ? '/' : pathname.startsWith('/ja/') ? pathname.slice(3) : pathname
  return `${localePath(target, bare)}${search}`
}

export function useSwitchLocaleHref(): string {
  const locale = useLocale()
  return useRouterState({
    select: (s) => otherLocalePath(locale, s.location.pathname, s.location.searchStr),
  })
}

export function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  )
}

export function categoryLabel(category: string, dict: Dict): string {
  return dict.labels.categories[category as Category] ?? category
}

export function platformLabel(platform: string, dict: Dict): string {
  return dict.labels.platforms[platform as Platform] ?? platform
}

export function pricingLabel(pricing: string, dict: Dict): string {
  return dict.labels.pricing[pricing as Pricing] ?? pricing
}

export { en, ja }
