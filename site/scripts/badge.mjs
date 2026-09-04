#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import satoriImport from 'satori'

const satori = satoriImport.default ?? satoriImport

const SITE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = join(SITE_ROOT, '..')
const APPS_SRC = join(REPO_ROOT, 'apps')
const PUBLIC_DIR = join(SITE_ROOT, 'public')
const BADGE_DIR = join(PUBLIC_DIR, 'badge')
const FONTS_DIR = join(SITE_ROOT, 'scripts', 'fonts')
const GENERATED_DIR = join(SITE_ROOT, 'src', 'generated')
const GITHUB_JSON = join(GENERATED_DIR, 'github.json')
const NPM_JSON = join(GENERATED_DIR, 'npm.json')
const BADGE_JSON = join(GENERATED_DIR, 'badge.json')
const WORDMARK_PATH = join(PUBLIC_DIR, 'logo_humation.svg')
const SYMBOL_PATH = join(PUBLIC_DIR, 'symbol_humation.svg')

const RENDER_WIDTH = 400
const HEIGHT = 56
const WORDMARK_W = 102
const WORDMARK_H = 16
const STAR_SIZE = 14
const SYMBOL_H = 26
const SYMBOL_W = Math.round((SYMBOL_H * 325.25) / 331)
const SYMBOL_MARGIN_TOP = 1

/** Show GitHub stars / npm downloads on the badge. The fetch + render code stays; flip to true to bring them back. */
const SHOW_STATS = false

const FONT_REGULAR = join(FONTS_DIR, 'Inter-Regular.woff')
const FONT_BOLD = join(FONTS_DIR, 'Inter-Bold.woff')
if (!existsSync(FONT_REGULAR) || !existsSync(FONT_BOLD)) {
  throw new Error('Inter fonts missing in site/scripts/fonts (need Inter-Regular.woff and Inter-Bold.woff)')
}

if (!existsSync(WORDMARK_PATH)) {
  throw new Error('Wordmark missing at site/public/logo_humation.svg')
}

if (!existsSync(SYMBOL_PATH)) {
  throw new Error('Symbol missing at site/public/symbol_humation.svg')
}

const STAR_D =
  'M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z'

const VARIANTS = {
  light: { bg: '#ffffff', fg: '#1d1d1f', muted: '#6e6e73', border: '#d2d2d7' },
  dark: { bg: '#000000', fg: '#f5f5f7', muted: '#a1a1a6', border: '#38383a' },
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

/** @param {string} svg */
function parsePathDs(svg) {
  const ds = []
  const re = /<path\b[^>]*\bd="([^"]+)"/g
  let m
  while ((m = re.exec(svg))) ds.push(m[1])
  return ds
}

/**
 * @param {string} svg
 * @returns {{ d: string, fill: string | undefined }[]}
 */
function parsePaths(svg) {
  const paths = []
  const re = /<path\b[^>]*>/g
  let m
  while ((m = re.exec(svg))) {
    const tag = m[0]
    const d = (tag.match(/\bd="([^"]*)"/) || [])[1]
    const fill = (tag.match(/\bfill="([^"]*)"/) || [])[1]
    if (d) paths.push({ d, fill })
  }
  return paths
}

/** @param {string | undefined} fill */
function isWhite(fill) {
  return /^(#fff|#ffffff|white)$/i.test(String(fill ?? ''))
}

const WORDMARK_DS = parsePathDs(readFileSync(WORDMARK_PATH, 'utf8'))
if (WORDMARK_DS.length === 0) {
  throw new Error('No <path d> attributes found in site/public/logo_humation.svg')
}

const SYMBOL_PATHS = parsePaths(
  readFileSync(SYMBOL_PATH, 'utf8')
    .replace(/<mask\b[\s\S]*?<\/mask>/g, '')
    .replace(/<defs\b[\s\S]*?<\/defs>/g, ''),
)
if (SYMBOL_PATHS.length === 0) {
  throw new Error('No <path> elements found in site/public/symbol_humation.svg')
}

/** @param {number} n */
function formatCount(n) {
  if (n < 1000) return String(n)
  if (n < 10_000) {
    const tenths = Math.round(n / 100) / 10
    return `${tenths}k`
  }
  return `${Math.round(n / 1000)}k`
}

/** @returns {number | null} */
function readStars() {
  if (!existsSync(GITHUB_JSON)) return null
  try {
    const data = JSON.parse(readFileSync(GITHUB_JSON, 'utf8'))
    return typeof data.stars === 'number' ? data.stars : null
  } catch {
    return null
  }
}

/** @returns {number | null} */
function readDownloads() {
  if (!existsSync(NPM_JSON)) return null
  try {
    const data = JSON.parse(readFileSync(NPM_JSON, 'utf8'))
    return typeof data.downloads === 'number' ? data.downloads : null
  } catch {
    return null
  }
}

/** @param {string} fg */
function wordmarkSvg(fg) {
  return el(
    'svg',
    { width: WORDMARK_W, height: WORDMARK_H, viewBox: '0 0 102 16', fill: 'none' },
    WORDMARK_DS.map((d) => el('path', { d, fill: fg })),
  )
}

/**
 * @param {string} fg
 * @param {number} [size]
 */
function starSvg(fg, size = STAR_SIZE) {
  return el(
    'svg',
    { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' },
    el('path', { d: STAR_D, fill: fg }),
  )
}

/**
 * Tabler "download" — stroke lives on each path so inlining does not drop it.
 * @param {string} fg
 * @param {number} [size]
 */
function downloadSvg(fg, size = 13) {
  const stroke = {
    fill: 'none',
    stroke: fg,
    strokeWidth: 2.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  return el(
    'svg',
    { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' },
    [
      el('path', { d: 'M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2', ...stroke }),
      el('path', { d: 'M7 11l5 5l5 -5', ...stroke }),
      el('path', { d: 'M12 4l0 12', ...stroke }),
    ],
  )
}

/**
 * @param {string} fg
 * @param {string} bg
 */
function symbolSvg(fg, bg) {
  /** @type {Record<string, unknown>} */
  const props = { width: SYMBOL_W, height: SYMBOL_H, viewBox: '10.75 61 325.25 331', fill: 'none' }
  if (SYMBOL_MARGIN_TOP) props.style = { marginTop: SYMBOL_MARGIN_TOP }
  return el(
    'svg',
    props,
    SYMBOL_PATHS.map(({ d, fill }) => el('path', { d, fill: isWhite(fill) ? bg : fg })),
  )
}

/**
 * @param {object} opts
 * @param {string} opts.bg
 * @param {string} opts.fg
 * @param {string} opts.muted
 * @param {string} opts.border
 * @param {number | null} opts.stars
 * @param {number | null} opts.downloads
 */
function badgeTree({ bg, fg, muted, border, stars, downloads }) {
  const left = el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        marginRight: 3,
      },
    },
    [
      el(
        'div',
        {
          style: {
            display: 'flex',
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: 1.2,
            lineHeight: 1,
            color: muted,
          },
        },
        'BUILT WITH',
      ),
      wordmarkSvg(fg),
    ],
  )

  /** @type {unknown[]} */
  const children = [symbolSvg(fg, bg), left]

  /** @type {{ icon: unknown, text: string }[]} */
  const stats = []
  const twoStats = typeof stars === 'number' && typeof downloads === 'number'
  const iconSize = twoStats ? 13 : 14
  if (SHOW_STATS && typeof stars === 'number') stats.push({ icon: starSvg(fg, iconSize), text: formatCount(stars) })
  if (SHOW_STATS && typeof downloads === 'number') stats.push({ icon: downloadSvg(fg, iconSize), text: formatCount(downloads) })

  if (stats.length > 0) {
    const fontSize = stats.length === 1 ? 14 : 13
    const statRow = (stat) =>
      el(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          },
        },
        [
          stat.icon,
          el(
            'div',
            {
              style: {
                display: 'flex',
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize,
                lineHeight: 1,
                color: fg,
              },
            },
            stat.text,
          ),
        ],
      )

    children.push(
      el('div', {
        style: {
          display: 'flex',
          width: 1,
          height: 28,
          backgroundColor: border,
        },
      }),
    )
    if (stats.length === 1) {
      children.push(statRow(stats[0]))
    } else {
      children.push(
        el(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'flex-start',
            },
          },
          stats.map(statRow),
        ),
      )
    }
  }

  const row = el(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: HEIGHT,
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: 10,
        paddingLeft: 14,
        paddingRight: 14,
        gap: 12,
        boxSizing: 'border-box',
      },
    },
    children,
  )

  return el(
    'div',
    { style: { display: 'flex', width: RENDER_WIDTH, height: HEIGHT, backgroundColor: 'transparent' } },
    [row],
  )
}

/** @param {string} svg */
function measureContentWidth(svg) {
  const clip = svg.match(/<clipPath id="satori_bc-id[^"]*">([\s\S]*?)<\/clipPath>/)
  const hMatch = clip?.[1].match(/\bh(\d+(?:\.\d+)?)/)
  if (hMatch) {
    const contentWidth = Math.ceil(Number(hMatch[1]) + 20)
    if (contentWidth >= 150 && contentWidth <= 360) return contentWidth
    throw new Error(`badge content width ${contentWidth} is not between 150 and 360`)
  }
  const mask = svg.match(/<rect x="1" y="1" width="(\d+(?:\.\d+)?)/)
  if (mask) {
    const contentWidth = Math.ceil(Number(mask[1]) + 2)
    if (contentWidth >= 150 && contentWidth <= 360) return contentWidth
    throw new Error(`badge content width ${contentWidth} is not between 150 and 360`)
  }
  throw new Error('could not measure badge content width from satori clipPath or mask')
}

/** @param {string} svg */
function attr(svg, name) {
  return (svg.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1]
}

/** Satori embeds nested <svg> as <image href="data:image/svg+xml">; inline them as real paths. */
function inlineNestedSvgs(svg) {
  return svg.replace(/<image\b([^>]*?)(?:\/>|><\/image>)/g, (full, attrs) => {
    const rawHref = attr(attrs, 'href') || attr(attrs, 'xlink:href')
    if (!rawHref) return full
    const href = rawHref
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    if (!href.startsWith('data:image/svg+xml')) return full

    const comma = href.indexOf(',')
    if (comma < 0) return full
    const meta = href.slice(0, comma)
    const data = href.slice(comma + 1)
    const payload = /;base64/i.test(meta)
      ? Buffer.from(data, 'base64').toString('utf8')
      : decodeURIComponent(data)

    const innerMatch = payload.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/i)
    if (!innerMatch) return full
    const innerAttrs = innerMatch[1]
    const innerContent = innerMatch[2]

    const x = Number(attr(attrs, 'x') || 0)
    const y = Number(attr(attrs, 'y') || 0)
    const outW = Number(attr(attrs, 'width') || 0)
    const outH = Number(attr(attrs, 'height') || 0)

    let vbX = 0
    let vbY = 0
    let vbW = Number(attr(innerAttrs, 'width') || 0)
    let vbH = Number(attr(innerAttrs, 'height') || 0)
    const vb = attr(innerAttrs, 'viewBox')
    if (vb) {
      const parts = vb.trim().split(/[\s,]+/).map(Number)
      if (parts.length === 4) {
        vbX = parts[0]
        vbY = parts[1]
        vbW = parts[2]
        vbH = parts[3]
      }
    }
    const sx = vbW ? outW / vbW : 1
    const sy = vbH ? outH / vbH : 1
    const transforms = [`translate(${x},${y})`]
    if (sx !== 1 || sy !== 1) transforms.push(`scale(${sx},${sy})`)
    if (vbX || vbY) transforms.push(`translate(${-vbX},${-vbY})`)
    const transform = transforms.join(' ')
    const clipPath = attr(attrs, 'clip-path')
    const inner = `<g transform="${transform}">${innerContent}</g>`
    return clipPath ? `<g clip-path="${clipPath}">${inner}</g>` : inner
  })
}

/** Drop satori clipPath/mask defs that nothing in the document still references. */
function stripUnreferencedSatoriDefs(svg) {
  const referenced = new Set()
  const re = /url\(#([^)]+)\)/g
  let m
  while ((m = re.exec(svg))) referenced.add(m[1])

  return svg
    .replace(/<clipPath id="(satori_cp-id-[^"]*)">.*?<\/clipPath>/gs, (full, id) =>
      referenced.has(id) ? full : '',
    )
    .replace(/<mask id="(satori_om-id-[^"]+-[0-9]+[^"]*)">.*?<\/mask>/gs, (full, id) =>
      referenced.has(id) ? full : '',
    )
}

/**
 * @param {string} svg
 * @param {number} contentWidth
 */
function decorateSvg(svg, contentWidth) {
  const inlined = stripUnreferencedSatoriDefs(inlineNestedSvgs(svg))
  const match = inlined.match(/^<svg\b([^>]*)>/)
  if (!match) return inlined
  let attrs = match[1]
  if (!/\brole=/.test(attrs)) attrs += ' role="img"'
  if (/\bwidth=/.test(attrs)) attrs = attrs.replace(/\bwidth="[^"]*"/, `width="${contentWidth}"`)
  else attrs += ` width="${contentWidth}"`
  if (/\bheight=/.test(attrs)) attrs = attrs.replace(/\bheight="[^"]*"/, `height="${HEIGHT}"`)
  else attrs += ` height="${HEIGHT}"`
  if (/\bviewBox=/.test(attrs)) attrs = attrs.replace(/\bviewBox="[^"]*"/, `viewBox="0 0 ${contentWidth} ${HEIGHT}"`)
  else attrs += ` viewBox="0 0 ${contentWidth} ${HEIGHT}"`
  return `<svg${attrs}><title>Built with Humation</title>${inlined.slice(match[0].length)}`
}

/**
 * @param {unknown} tree
 * @param {{ name: string, data: Buffer, weight: number, style: string }[]} fonts
 */
async function renderSvg(tree, fonts) {
  return await satori(tree, { width: RENDER_WIDTH, height: HEIGHT, fonts })
}

async function main() {
  const fonts = [
    { name: 'Inter', data: readFileSync(FONT_REGULAR), weight: 400, style: 'normal' },
    { name: 'Inter', data: readFileSync(FONT_BOLD), weight: 700, style: 'normal' },
  ]

  const slugs = existsSync(APPS_SRC)
    ? readdirSync(APPS_SRC, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(APPS_SRC, d.name, 'app.json')))
        .map((d) => d.name)
        .sort()
    : []

  const stars = readStars()
  const downloads = readDownloads()

  if (existsSync(BADGE_DIR)) rmSync(BADGE_DIR, { recursive: true, force: true })
  mkdirSync(BADGE_DIR, { recursive: true })

  const lightRaw = await renderSvg(badgeTree({ ...VARIANTS.light, stars, downloads }), fonts)
  const darkRaw = await renderSvg(badgeTree({ ...VARIANTS.dark, stars, downloads }), fonts)
  const lightWidth = measureContentWidth(lightRaw)
  const darkWidth = measureContentWidth(darkRaw)
  if (lightWidth !== darkWidth) {
    throw new Error(`badge widths differ: light=${lightWidth} dark=${darkWidth}`)
  }
  const contentWidth = lightWidth
  mkdirSync(GENERATED_DIR, { recursive: true })
  writeFileSync(BADGE_JSON, `${JSON.stringify({ width: contentWidth, height: HEIGHT }, null, 2)}\n`)
  console.log(`badge.json width=${contentWidth} height=${HEIGHT}`)

  const lightSvg = decorateSvg(lightRaw, contentWidth)
  const darkSvg = decorateSvg(darkRaw, contentWidth)

  for (const slug of slugs) {
    try {
      writeFileSync(join(BADGE_DIR, `${slug}.svg`), lightSvg)
      console.log(`badge ${slug}.svg`)
    } catch (err) {
      console.error(`badge ${slug}.svg failed: ${err instanceof Error ? err.message : err}`)
    }
    try {
      writeFileSync(join(BADGE_DIR, `${slug}-dark.svg`), darkSvg)
      console.log(`badge ${slug}-dark.svg`)
    } catch (err) {
      console.error(`badge ${slug}-dark.svg failed: ${err instanceof Error ? err.message : err}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
