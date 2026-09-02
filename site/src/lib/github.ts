import { useEffect, useState } from 'react'
import data from '../generated/github.json'

type GithubJson = {
  repo: string
  stars: number | null
  fetchedAt: string | null
}

const github = data as GithubJson

const GITHUB_REPO_URL = 'https://api.github.com/repos/humation-labs/humation'
const STARS_CACHE_KEY = 'gh-stars'
const STARS_CACHE_TTL_MS = 60 * 60 * 1000

type StarsCache = {
  stars: number
  at: number
}

export function githubStars(): number | null {
  return typeof github.stars === 'number' ? github.stars : null
}

export function formatStars(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10_000) {
    const tenths = Math.round(n / 100) / 10
    return `${tenths}k`
  }
  return `${Math.round(n / 1000)}k`
}

function readStarsCache(): StarsCache | null {
  try {
    const raw = sessionStorage.getItem(STARS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StarsCache
    if (typeof parsed.stars !== 'number' || typeof parsed.at !== 'number') return null
    if (Date.now() - parsed.at > STARS_CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeStarsCache(stars: number) {
  try {
    sessionStorage.setItem(STARS_CACHE_KEY, JSON.stringify({ stars, at: Date.now() }))
  } catch {
    // Ignore storage access errors (private mode, quota).
  }
}

export function useGitHubStars(initial: number | null): number | null {
  const [stars, setStars] = useState(initial)

  useEffect(() => {
    const cached = readStarsCache()
    if (cached) {
      setStars(cached.stars)
      return
    }

    const controller = new AbortController()
    fetch(GITHUB_REPO_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ stargazers_count?: unknown }>
      })
      .then((body) => {
        if (typeof body.stargazers_count !== 'number') return
        writeStarsCache(body.stargazers_count)
        setStars(body.stargazers_count)
      })
      .catch(() => {
        // Keep the build-time value on any failure.
      })

    return () => controller.abort()
  }, [])

  return stars
}
