import { useRouterState } from '@tanstack/react-router'

export function usePageData<T>(): T {
  const data = useRouterState({
    select: (s) => s.matches[s.matches.length - 1]?.loaderData,
  })
  return data as T
}

export function usePageSearch<T>(): T {
  const search = useRouterState({
    select: (s) => s.location.search,
  })
  return search as T
}
