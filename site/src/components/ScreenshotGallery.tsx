type Shot = {
  file: string
  src: string
  alt: string
  width: number
  height: number
}

export function ScreenshotGallery({ shots }: { shots: Shot[] }) {
  if (shots.length === 0) return null

  const landscape = shots[0].width >= shots[0].height

  return (
    <div
      className={
        landscape
          ? 'grid grid-cols-1 gap-4 md:grid-cols-2'
          : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'
      }
      role="region"
      aria-label="Screenshots"
    >
      {shots.map((shot, i) => (
        <div
          key={shot.file}
          className="overflow-hidden rounded-lg border border-border/70 dark:border-white/15"
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
      ))}
    </div>
  )
}
