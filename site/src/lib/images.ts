import catalog from '../generated/images.json'

type ImageCatalog = Record<string, Record<string, { width: number; height: number }>>

export function imageDimensions(slug: string, file: string): { width: number; height: number } {
  const size = (catalog as ImageCatalog)[slug]?.[file]
  if (!size) {
    throw new Error(`Missing image dimensions for ${slug}/${file} in generated/images.json`)
  }
  return { width: size.width, height: size.height }
}
