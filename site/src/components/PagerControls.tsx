import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

const buttonClass =
  'absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export function PagerArrows({
  onPrev,
  onNext,
}: {
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <>
      <button type="button" aria-label="Previous" onClick={onPrev} className={`${buttonClass} left-2`}>
        <span className="inline-flex size-6 shrink-0 -translate-x-px items-center justify-center">
          <IconChevronLeft size={24} stroke={1.5} aria-hidden />
        </span>
      </button>
      <button type="button" aria-label="Next" onClick={onNext} className={`${buttonClass} right-2`}>
        <span className="inline-flex size-6 shrink-0 translate-x-px items-center justify-center">
          <IconChevronRight size={24} stroke={1.5} aria-hidden />
        </span>
      </button>
    </>
  )
}

export function PagerDots({
  index,
  count,
  onDot,
}: {
  index: number
  count: number
  onDot: (i: number) => void
}) {
  return (
    <div className="mt-3 flex justify-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index || undefined}
          onClick={() => onDot(i)}
          className={`h-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${i === index ? 'w-4 bg-text' : 'w-1.5 bg-text-muted/50'}`}
        />
      ))}
    </div>
  )
}
