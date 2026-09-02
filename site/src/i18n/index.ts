import { useParams, useRouterState } from '@tanstack/react-router'
import type { Category, Platform, Pricing } from '../lib/constants'
import { en } from './en'
import { ja } from './ja'

export type Locale = 'en' | 'ja'
export type Dict = typeof en

export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
}

export function langParam(locale: Locale): 'ja' | undefined {
  return locale === 'ja' ? 'ja' : undefined
}

export function localeFromLang(lang: string | undefined): Locale {
  return lang === 'ja' ? 'ja' : 'en'
}

export function useLocale(): Locale {
  const params = useParams({ strict: false })
  return localeFromLang(params.lang)
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

export function localePath(barePath: string, locale: Locale): string {
  if (locale === 'en') return barePath
  return barePath === '/' ? '/ja' : `/ja${barePath}`
}

export function switchLocalePath(pathname: string): string {
  if (pathname === '/ja' || pathname.startsWith('/ja/')) {
    return pathname.slice(3) || '/'
  }
  return pathname === '/' ? '/ja' : `/ja${pathname}`
}

export function useSwitchLocaleHref(): string {
  return useRouterState({
    select: (s) => `${switchLocalePath(s.location.pathname)}${s.location.searchStr}`,
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
