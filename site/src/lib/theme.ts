import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");if(p!=="light"&&p!=="dark")p="system";var t=p==="system"?(matchMedia("${DARK_QUERY}").matches?"dark":"light"):p;var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t}catch(e){}})()`

type ThemeSnapshot = {
  preference: ThemePreference
  resolved: ResolvedTheme
}

const SSR_SNAPSHOT: ThemeSnapshot = { preference: 'system', resolved: 'light' }

const listeners = new Set<(snapshot: ThemeSnapshot) => void>()
let snapshot: ThemeSnapshot = SSR_SNAPSHOT
let mediaBound = false

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemePreference(stored)) return stored
  } catch {
    // Ignore storage access errors (private mode, SSR).
  }
  return 'system'
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
  return preference
}

function applyResolved(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  root.style.colorScheme = resolved
}

function emit(next: ThemeSnapshot) {
  snapshot = next
  applyResolved(next.resolved)
  for (const listener of listeners) listener(next)
}

function bindMedia() {
  if (mediaBound) return
  mediaBound = true
  window.matchMedia(DARK_QUERY).addEventListener('change', () => {
    if (snapshot.preference !== 'system') return
    emit({ preference: 'system', resolved: resolveTheme('system') })
  })
}

function hydrateTheme(): ThemeSnapshot {
  const preference = readPreference()
  snapshot = { preference, resolved: resolveTheme(preference) }
  applyResolved(snapshot.resolved)
  bindMedia()
  return snapshot
}

export function nextThemePreference(preference: ThemePreference): ThemePreference {
  if (preference === 'light') return 'dark'
  if (preference === 'dark') return 'system'
  return 'light'
}

export function useTheme(): {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
} {
  const [state, setState] = useState<ThemeSnapshot>(SSR_SNAPSHOT)

  useEffect(() => {
    setState(hydrateTheme())
    const onChange = (next: ThemeSnapshot) => setState(next)
    listeners.add(onChange)
    return () => {
      listeners.delete(onChange)
    }
  }, [])

  const setPreference = useCallback((preference: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      // Ignore storage access errors.
    }
    emit({ preference, resolved: resolveTheme(preference) })
  }, [])

  return { preference: state.preference, resolved: state.resolved, setPreference }
}
