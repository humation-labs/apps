import type { Icon } from '@tabler/icons-react'
import {
  IconApps,
  IconBriefcase,
  IconChecklist,
  IconCode,
  IconDeviceGamepad2,
  IconHeart,
  IconMovie,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react'

const CATEGORY_ICONS: Record<string, Icon> = {
  social: IconUsers,
  games: IconDeviceGamepad2,
  productivity: IconChecklist,
  'developer-tools': IconCode,
  education: IconSchool,
  entertainment: IconMovie,
  lifestyle: IconHeart,
  business: IconBriefcase,
  other: IconApps,
}

function boxClass(size: number) {
  if (size <= 16) return 'size-4'
  if (size <= 20) return 'size-5'
  if (size <= 24) return 'size-6'
  if (size <= 28) return 'size-7'
  if (size <= 32) return 'size-8'
  if (size <= 40) return 'size-10'
  return ''
}

export function CategoryIcon({
  category,
  size = 20,
  className,
}: {
  category: string
  size?: number
  className?: string
}) {
  const Glyph = CATEGORY_ICONS[category] ?? IconApps
  const stroke = size <= 16 ? 1.75 : size >= 28 ? 2 : 1.5
  const box = boxClass(size)
  return (
    <span
      className={`inline-flex ${box} shrink-0 items-center justify-center ${className ?? ''}`}
      style={box ? undefined : { width: size, height: size }}
    >
      <Glyph size={size} stroke={stroke} aria-hidden />
    </span>
  )
}
