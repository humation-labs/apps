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
  const stroke = size <= 16 ? 1.75 : 1.5
  return <Glyph size={size} stroke={stroke} className={className} aria-hidden />
}
