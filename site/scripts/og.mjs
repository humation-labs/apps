#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import satoriImport from 'satori'
import { Resvg } from '@resvg/resvg-js'

const satori = satoriImport.default ?? satoriImport

const SITE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = join(SITE_ROOT, '..')
const APPS_SRC = join(REPO_ROOT, 'apps')
const PUBLIC_DIR = join(SITE_ROOT, 'public')
const OG_DIR = join(PUBLIC_DIR, 'og')
const FONTS_DIR = join(SITE_ROOT, 'scripts', 'fonts')
const IMAGES_JSON = join(SITE_ROOT, 'src', 'generated', 'images.json')
const FEATURED_JSON = join(SITE_ROOT, 'src', 'data', 'featured.json')
const SYMBOL_PATH = join(PUBLIC_DIR, 'favicon.png')
const WORDMARK_BLACK_PATH = join(PUBLIC_DIR, 'logo_humation.svg')
const WORDMARK_WHITE_PATH = join(PUBLIC_DIR, 'logo_humation_dk.svg')
const WORDMARK_RATIO = 102 / 16

const WIDTH = 1200
const HEIGHT = 630

const FONT_REGULAR = join(FONTS_DIR, 'Inter-Regular.woff')
const FONT_BOLD = join(FONTS_DIR, 'Inter-Bold.woff')
if (!existsSync(FONT_REGULAR) || !existsSync(FONT_BOLD)) {
  throw new Error('Inter fonts missing in site/scripts/fonts (need Inter-Regular.woff and Inter-Bold.woff)')
}

/**
 * @param {string} type
 * @param {Record<string, unknown>} [props]
 * @param {unknown} [children]
 */
function el(type, props = {}, children) {
  /** @type {Record<string, unknown>} */
  const next = { ...props }
  if (children !== undefined) {
    next.children = Array.isArray(children) ? children.filter((c) => c != null) : children
  }
  return { type, props: next }
}

/** @param {string} filePath */
function pngDataUrl(filePath) {
  return `data:image/png;base64,${readFileSync(filePath).toString('base64')}`
}

/** @param {string} filePath */
function svgDataUrl(filePath) {
  return `data:image/svg+xml;base64,${readFileSync(filePath).toString('base64')}`
}

const SYMBOL_SRC = pngDataUrl(SYMBOL_PATH)
const WORDMARK_BLACK_SRC = svgDataUrl(WORDMARK_BLACK_PATH)
const WORDMARK_WHITE_SRC = svgDataUrl(WORDMARK_WHITE_PATH)

/** @param {number} height */
function wordmarkDims(height) {
  return { width: Math.round(height * WORDMARK_RATIO), height }
}

/**
 * @param {number} size
 * @param {number} radius
 */
function symbolImg(size, radius) {
  return el('img', {
    src: SYMBOL_SRC,
    width: size,
    height: size,
    style: { width: size, height: size, borderRadius: radius },
  })
}

/**
 * @param {boolean} darkBg
 * @param {number} height
 */
function wordmarkImg(darkBg, height) {
  const { width } = wordmarkDims(height)
  return el('img', {
    src: darkBg ? WORDMARK_WHITE_SRC : WORDMARK_BLACK_SRC,
    width,
    height,
    style: { width, height },
  })
}

/** @param {string} hex */
function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * @param {string} hex
 * @param {number} alpha
 */
function withAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/**
 * @param {object} opts
 * @param {string} opts.name
 * @param {string} opts.tagline
 * @param {string} opts.brand
 * @param {string | null} opts.iconDataUrl
 * @param {{ dataUrl: string, width: number, height: number, portrait: boolean } | null} opts.shot
 */
function listingTree({ name, tagline, brand, iconDataUrl, shot }) {
  const darkBg = relativeLuminance(brand) < 0.5
  const fg = darkBg ? '#ffffff' : '#000000'
  const fgMuted = withAlpha(fg, 0.8)
  const fgLabel = withAlpha(fg, 0.7)

  /** @type {unknown} */
  let shotEl = null
  if (shot) {
    if (shot.portrait) {
      const w = 420
      const h = (w * shot.height) / shot.width
      shotEl = el(
        'div',
        {
          style: {
            display: 'flex',
            position: 'absolute',
            left: 720,
            top: 72,
            width: w,
            height: h,
            borderRadius: w * 0.14,
            overflow: 'hidden',
          },
        },
        el('img', {
          src: shot.dataUrl,
          width: w,
          height: h,
          style: { width: w, height: h, objectFit: 'cover' },
        }),
      )
    } else {
      const w = 560
      const h = (w * shot.height) / shot.width
      shotEl = el(
        'div',
        {
          style: {
            display: 'flex',
            position: 'absolute',
            right: 72,
            top: Math.round((HEIGHT - h) / 2),
            width: w,
            height: h,
            borderRadius: 24,
            overflow: 'hidden',
          },
        },
        el('img', {
          src: shot.dataUrl,
          width: w,
          height: h,
          style: { width: w, height: h, objectFit: 'cover' },
        }),
      )
    }
  }

  const left = el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        width: 720,
        height: HEIGHT,
      },
    },
    [
      el('div', { style: { display: 'flex', flexDirection: 'column', width: 576 } }, [
        iconDataUrl
          ? el('img', {
              src: iconDataUrl,
              width: 120,
              height: 120,
              style: { width: 120, height: 120, borderRadius: 26 },
            })
          : null,
        el(
          'div',
          {
            style: {
              display: 'flex',
              marginTop: 28,
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 1.05,
              color: fg,
            },
          },
          name,
        ),
        el(
          'div',
          {
            style: {
              display: 'flex',
              marginTop: 16,
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: 34,
              lineHeight: 1.25,
              color: fgMuted,
              width: 576,
              maxHeight: 90,
              overflow: 'hidden',
              lineClamp: 2,
              textOverflow: 'ellipsis',
            },
          },
          tagline,
        ),
      ]),
      el(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          },
        },
        [
          symbolImg(44, 10),
          wordmarkImg(darkBg, 22),
          el(
            'div',
            {
              style: {
                display: 'flex',
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: 26,
                color: fgLabel,
              },
            },
            'Apps',
          ),
        ],
      ),
    ],
  )

  return el(
    'div',
    {
      style: {
        display: 'flex',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: brand,
        overflow: 'hidden',
        position: 'relative',
      },
    },
    [shotEl, left],
  )
}

/** @param {string[]} iconUrls */
function defaultTree(iconUrls) {
  const icons = iconUrls.map((src) =>
    el('img', {
      src,
      width: 140,
      height: 140,
      style: { width: 140, height: 140, borderRadius: 30 },
    }),
  )

  return el(
    'div',
    {
      style: {
        display: 'flex',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: '#000000',
        overflow: 'hidden',
        position: 'relative',
      },
    },
    [
      el(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 72,
            width: WIDTH,
            height: HEIGHT,
          },
        },
        [
          el('div', { style: { display: 'flex', flexDirection: 'column' } }, [
            el(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                },
              },
              [
                symbolImg(96, 22),
                wordmarkImg(true, 64),
                el(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      fontSize: 64,
                      color: 'rgba(255,255,255,0.6)',
                    },
                  },
                  'Apps',
                ),
              ],
            ),
            el(
              'div',
              {
                style: {
                  display: 'flex',
                  marginTop: 24,
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: 40,
                  color: 'rgba(255,255,255,0.8)',
                },
              },
              'Apps built with Humation',
            ),
          ]),
        ],
      ),
      icons.length > 0
        ? el(
            'div',
            {
              style: {
                display: 'flex',
                position: 'absolute',
                right: 72,
                top: 0,
                height: HEIGHT,
                alignItems: 'center',
                gap: 24,
              },
            },
            icons,
          )
        : null,
    ],
  )
}

/**
 * @param {unknown} tree
 * @param {{ name: string, data: Buffer, weight: number, style: string }[]} fonts
 */
async function renderPng(tree, fonts) {
  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts })
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  })
  return resvg.render().asPng()
}

async function main() {
  const fonts = [
    { name: 'Inter', data: readFileSync(FONT_REGULAR), weight: 400, style: 'normal' },
    { name: 'Inter', data: readFileSync(FONT_BOLD), weight: 700, style: 'normal' },
  ]

  /** @type {Record<string, Record<string, { width: number, height: number, color?: string }>>} */
  const images = existsSync(IMAGES_JSON) ? JSON.parse(readFileSync(IMAGES_JSON, 'utf8')) : {}

  /** @type {string[]} */
  const featured = existsSync(FEATURED_JSON) ? JSON.parse(readFileSync(FEATURED_JSON, 'utf8')) : []

  const slugs = existsSync(APPS_SRC)
    ? readdirSync(APPS_SRC, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(APPS_SRC, d.name, 'app.json')))
        .map((d) => d.name)
        .sort()
    : []

  /** @type {{ slug: string, name: string, tagline: string, addedAt: string, icon: string, screenshots: { file: string }[] }[]} */
  const listings = []
  for (const slug of slugs) {
    try {
      const raw = JSON.parse(readFileSync(join(APPS_SRC, slug, 'app.json'), 'utf8'))
      listings.push({
        slug,
        name: raw.name,
        tagline: raw.tagline ?? '',
        addedAt: raw.addedAt ?? '',
        icon: raw.icon ?? 'icon.png',
        screenshots: Array.isArray(raw.screenshots) ? raw.screenshots : [],
      })
    } catch (err) {
      console.error(`og ${slug}.png failed: ${err instanceof Error ? err.message : err}`)
    }
  }

  if (existsSync(OG_DIR)) rmSync(OG_DIR, { recursive: true, force: true })
  mkdirSync(OG_DIR, { recursive: true })

  const bySlug = new Map(listings.map((l) => [l.slug, l]))
  const iconOrder = []
  for (const slug of featured) {
    if (bySlug.has(slug) && !iconOrder.includes(slug)) iconOrder.push(slug)
  }
  for (const listing of [...listings].sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.name.localeCompare(b.name))) {
    if (!iconOrder.includes(listing.slug)) iconOrder.push(listing.slug)
  }

  const defaultIcons = []
  for (const slug of iconOrder.slice(0, 4)) {
    const listing = bySlug.get(slug)
    if (!listing) continue
    const iconPath = join(APPS_SRC, slug, listing.icon)
    if (existsSync(iconPath)) defaultIcons.push(pngDataUrl(iconPath))
  }

  const defaultPng = await renderPng(defaultTree(defaultIcons), fonts)
  writeFileSync(join(OG_DIR, 'default.png'), defaultPng)
  console.log('og default.png')

  for (const listing of listings) {
    try {
      const meta = images[listing.slug] ?? {}
      const brand = meta['icon.png']?.color ?? '#000000'
      const iconPath = join(APPS_SRC, listing.slug, listing.icon)
      const iconDataUrl = existsSync(iconPath) ? pngDataUrl(iconPath) : null

      const firstShot = listing.screenshots[0]
      /** @type {{ dataUrl: string, width: number, height: number, portrait: boolean } | null} */
      let shot = null
      if (firstShot?.file) {
        const shotPath = join(APPS_SRC, listing.slug, firstShot.file)
        const shotMeta = meta[firstShot.file]
        if (existsSync(shotPath) && shotMeta?.width && shotMeta?.height) {
          shot = {
            dataUrl: pngDataUrl(shotPath),
            width: shotMeta.width,
            height: shotMeta.height,
            portrait: shotMeta.height > shotMeta.width,
          }
        }
      }

      const png = await renderPng(
        listingTree({
          name: listing.name,
          tagline: listing.tagline,
          brand,
          iconDataUrl,
          shot,
        }),
        fonts,
      )
      writeFileSync(join(OG_DIR, `${listing.slug}.png`), png)
      console.log(`og ${listing.slug}.png`)
    } catch (err) {
      console.error(`og ${listing.slug}.png failed: ${err instanceof Error ? err.message : err}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
