import data from '../generated/github.json'

type GithubJson = {
  repo: string
  stars: number | null
  fetchedAt: string | null
}

const github = data as GithubJson

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
