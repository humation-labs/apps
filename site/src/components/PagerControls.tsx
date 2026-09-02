import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { IconLine } from './IconLine'

const buttonClass =
  'absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none'

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
        <IconChevronLeft size={20} aria-hidden />
      </button>
      <button type="button" aria-label="Next" onClick={onNext} className={`${buttonClass} right-2`}>
        <IconChevronRight size={20} aria-hidden />
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
          className={`h-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${i === index ? 'w-4 bg-text' : 'w-1.5 bg-text-muted/50'}`}
        />
      ))}
    </div>
  )
}
