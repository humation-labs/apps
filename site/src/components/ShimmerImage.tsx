import { useEffect, useRef, useState, type ImgHTMLAttributes, type CSSProperties } from 'react'

type Phase = 'unknown' | 'loading' | 'loaded'

/**
 * <img> with a shimmer layer behind it until the image has loaded.
 * - In prerendered HTML (before hydration) the image is rendered normally, so nothing is hidden
 *   for no-JS or cached-image cases.
 * - On mount, an already-complete image just drops the shimmer; an image still loading fades in.
 */
export function ShimmerImage({
  wrapperClassName = '',
  wrapperStyle,
  className = '',
  onLoad,
  onError,
  ...imgProps
}: ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
}) {
  const ref = useRef<HTMLImageElement>(null)
  const [phase, setPhase] = useState<Phase>('unknown')

  useEffect(() => {
    const img = ref.current
    if (!img) return
    if (img.complete) {
      setPhase('loaded')
    } else {
      setPhase('loading')
    }
  }, [])

  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(wrapperClassName)

  return (
    <span className={`block ${positioned ? '' : 'relative'} ${wrapperClassName}`} style={wrapperStyle}>
      {phase !== 'loaded' ? (
        <span aria-hidden className="shimmer pointer-events-none absolute inset-0 rounded-[inherit]" />
      ) : null}
      <img
        ref={ref}
        {...imgProps}
        onLoad={(e) => {
          setPhase('loaded')
          onLoad?.(e)
        }}
        onError={(e) => {
          setPhase('loaded')
          onError?.(e)
        }}
        className={`relative transition-opacity duration-300 ${phase === 'loading' ? 'opacity-0' : 'opacity-100'} ${className}`}
      />
    </span>
  )
}
