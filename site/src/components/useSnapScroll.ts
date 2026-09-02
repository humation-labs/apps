import { useCallback, useRef, useState } from 'react'

export function useSnapScroll(count: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = useCallback(
    (i: number) => {
      const el = ref.current
      if (!el || count < 1) return
      const next = Math.min(count - 1, Math.max(0, i))
      const child = el.children[next] as HTMLElement | undefined
      if (child) {
        el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' })
      }
      setIndex(next)
    },
    [count],
  )

  const onScroll = useCallback(() => {
    const el = ref.current
    if (!el || el.clientWidth === 0) return
    const next = Math.round(el.scrollLeft / el.clientWidth)
    setIndex(Math.min(count - 1, Math.max(0, next)))
  }, [count])

  return {
    ref,
    index,
    goTo,
    onScroll,
    prev: () => goTo(index - 1),
    next: () => goTo(index + 1),
  }
}
