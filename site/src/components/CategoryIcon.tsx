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
import { IconLine } from './IconLine'

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
  return <Glyph size={size} className={className} aria-hidden />
}
