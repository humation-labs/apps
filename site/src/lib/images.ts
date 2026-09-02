import catalog from '../generated/images.json'

type ImageEntry = { width: number; height: number; color?: string }
type ImageCatalog = Record<string, Record<string, ImageEntry>>

const FALLBACK_ICON_COLOR = '#1c1c1e'

export function imageDimensions(slug: string, file: string): { width: number; height: number } {
  const size = (catalog as ImageCatalog)[slug]?.[file]
  if (!size) {
    throw new Error(`Missing image dimensions for ${slug}/${file} in generated/images.json`)
  }
  return { width: size.width, height: size.height }
}

export function iconColor(slug: string): string {
  return (catalog as ImageCatalog)[slug]?.['icon.png']?.color ?? FALLBACK_ICON_COLOR
}
