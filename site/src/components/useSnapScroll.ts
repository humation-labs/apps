import { useCallback, useEffect, useRef, useState } from 'react'

export function useSnapScroll(count: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = useCallback(() => {
    const el = ref.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setAtStart(scrollLeft <= 1)
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
  }, [])

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
    updateEdges()
  }, [count, updateEdges])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    el.addEventListener('scroll', updateEdges, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', updateEdges)
    }
  }, [updateEdges, count])

  return {
    ref,
    index,
    goTo,
    onScroll,
    prev: () => goTo(index - 1),
    next: () => goTo(index + 1),
    atStart,
    atEnd,
  }
}
