#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = join(siteRoot, 'dist', 'client')
const dest = join(clientDir, '404.html')

if (existsSync(dest)) {
  process.exit(0)
}

const sources = [join(clientDir, '404', 'index.html'), join(clientDir, 'index.html')]

for (const src of sources) {
  if (existsSync(src)) {
    copyFileSync(src, dest)
    console.log(`copied ${src} -> ${dest}`)
    process.exit(0)
  }
}

console.warn('copy-404: no prerendered 404 page found under dist/client')
process.exit(1)
