import { useCallback, useEffect, useRef, useState } from 'react'
import { PagerArrows } from './PagerControls'

type Shot = {
  file: string
  src: string
  alt: string
  width: number
  height: number
}

export function ScreenshotGallery({ shots }: { shots: Shot[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const updateEdges = useCallback(() => {
    const el = ref.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setOverflows(scrollWidth > clientWidth + 1)
    setShowLeft(scrollLeft > 1)
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

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
  }, [updateEdges, shots.length])

  function scroll(direction: -1 | 1) {
    const el = ref.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    const left = el.scrollLeft
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
    const target =
      direction > 0
        ? children.find((child) => child.offsetLeft > left + pad + 4)
        : [...children].reverse().find((child) => child.offsetLeft < left + pad - 4)
    if (target) {
      el.scrollTo({ left: target.offsetLeft - pad, behavior: 'smooth' })
    }
  }

  if (shots.length === 0) return null

  return (
    <div className="relative min-w-0 -mx-6 lg:-mx-10">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain touch-pan-x px-6 lg:px-10 scroll-pl-6 lg:scroll-pl-10 scroll-pr-6 lg:scroll-pr-10"
        role="region"
        aria-label="Screenshots"
      >
        {shots.map((shot, i) => {
          const landscape = shot.width >= shot.height
          return (
            <div
              key={shot.file}
              className={`relative shrink-0 snap-start overflow-hidden rounded-lg border border-border/70 dark:border-white/15 ${
                landscape ? 'w-[640px] max-w-[85vw]' : 'w-[280px] max-w-full'
              }`}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                className="h-auto w-full object-top"
              />
            </div>
          )
        })}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent backdrop-blur-md mask-fade-l transition-opacity duration-150 ${
          showLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent backdrop-blur-md mask-fade-r transition-opacity duration-150 ${
          showRight ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {overflows ? (
        <PagerArrows
          onPrev={() => scroll(-1)}
          onNext={() => scroll(1)}
          showPrev={showLeft}
          showNext={showRight}
        />
      ) : null}
    </div>
  )
}
