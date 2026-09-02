#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { imageSize } from 'image-size';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPS_DIR = join(ROOT, 'apps');
const SCHEMA_PATH = join(ROOT, 'schema', 'app.schema.json');

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ICON_MAX = 512 * 1024;
const SCREENSHOT_MAX = 2 * 1024 * 1024;
const URL_TIMEOUT_MS = 10_000;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

const ALLOWED_TOP = new Set(['app.json', 'icon.png', 'screenshots']);

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSchema = ajv.compile(schema);

function parseArgs(argv) {
  let offline = false;
  const targets = [];
  for (const arg of argv) {
    if (arg === '--offline') offline = true;
    else targets.push(arg);
  }
  return { offline, targets };
}

function listAllSlugs() {
  if (!existsSync(APPS_DIR)) return [];
  return readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort();
}

function slugFromArg(arg) {
  const normalized = arg.replace(/\\/g, '/').replace(/\/+$/, '');
  if (normalized.startsWith('apps/')) return normalized.slice('apps/'.length);
  return normalized;
}

function formatBytes(n) {
  if (n >= 1024 * 1024) {
    const mb = n / (1024 * 1024);
    return `${mb % 1 === 0 ? mb.toFixed(0) : mb.toFixed(1)} MB`;
  }
  if (n >= 1024) return `${Math.ceil(n / 1024)} KB`;
  return `${n} bytes`;
}

function detectFormat(buf) {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(PNG_MAGIC)) return 'png';
  if (buf.length >= 3 && buf.subarray(0, 3).equals(JPEG_MAGIC)) return 'jpeg';
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

function expectedFormat(filename) {
  const ext = extname(filename).toLowerCase();
  if (ext === '.png') return 'png';
  if (ext === '.jpg' || ext === '.jpeg') return 'jpeg';
  if (ext === '.webp') return 'webp';
  return null;
}

function orientation(width, height) {
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

function formatLabel(fmt) {
  if (fmt === 'png') return 'PNG';
  if (fmt === 'jpeg') return 'JPEG';
  if (fmt === 'webp') return 'WebP';
  return 'unknown';
}

function readName(slug) {
  const path = join(APPS_DIR, slug, 'app.json');
  if (!existsSync(path)) return null;
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return typeof data.name === 'string' ? data.name : null;
  } catch {
    return null;
  }
}

function collectNames(slugs) {
  /** @type {Map<string, string[]>} */
  const byName = new Map();
  for (const slug of slugs) {
    const name = readName(slug);
    if (!name) continue;
    const key = name.toLowerCase();
    const list = byName.get(key) ?? [];
    list.push(slug);
    byName.set(key, list);
  }
  return byName;
}

function checkSlug(slug, err) {
  if (slug.length < 3 || slug.length > 40 || !SLUG_RE.test(slug)) {
    err('slug must match ^[a-z0-9]+(-[a-z0-9]+)*$ and be 3-40 characters');
  }
}

function checkDirectory(dir, data, err) {
  if (!existsSync(dir)) {
    err('directory does not exist');
    return;
  }

  const top = readdirSync(dir, { withFileTypes: true });
  for (const entry of top) {
    if (!ALLOWED_TOP.has(entry.name)) {
      err(`unexpected ${entry.isDirectory() ? 'directory' : 'file'} ${entry.name}`);
    }
  }

  const shotsDir = join(dir, 'screenshots');
  if (!existsSync(shotsDir)) {
    err('screenshots/ is missing');
    return;
  }
  if (!statSync(shotsDir).isDirectory()) {
    err('screenshots/ is not a directory');
    return;
  }

  const shotEntries = readdirSync(shotsDir, { withFileTypes: true });
  const files = [];
  for (const entry of shotEntries) {
    if (entry.isDirectory()) {
      err(`screenshots/ must not contain subdirectories (found ${entry.name})`);
      continue;
    }
    files.push(entry.name);
  }

  const referenced = new Set();
  if (data && Array.isArray(data.screenshots)) {
    for (const shot of data.screenshots) {
      if (shot && typeof shot.file === 'string') referenced.add(posix.basename(shot.file));
    }
  }

  if (referenced.size > 0) {
    for (const name of files) {
      if (!referenced.has(name)) {
        err(`screenshots/ contains unexpected file ${name}`);
      }
    }
  }
}

function checkSchema(dir, err) {
  const path = join(dir, 'app.json');
  if (!existsSync(path)) {
    err('app.json is missing');
    return null;
  }
  let data;
  try {
    data = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    err(`app.json is not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
  const valid = validateSchema(data);
  if (!valid && validateSchema.errors) {
    for (const error of validateSchema.errors) {
      const instancePath = error.instancePath || '/';
      err(`${instancePath} ${error.message}`);
    }
  }
  return data;
}

function dimensionsOf(buf) {
  try {
    const size = imageSize(buf);
    return { width: size.width, height: size.height };
  } catch {
    return { width: undefined, height: undefined };
  }
}

function checkIcon(dir, err) {
  const path = join(dir, 'icon.png');
  if (!existsSync(path)) {
    err('icon.png is missing');
    return;
  }
  const buf = readFileSync(path);
  const format = detectFormat(buf);
  if (format !== 'png') {
    err('icon.png is not a PNG (magic bytes)');
    return;
  }
  if (buf.length > ICON_MAX) {
    err(`icon.png is ${formatBytes(buf.length)} (max 512 KB)`);
  }
  const { width, height } = dimensionsOf(buf);
  if (width !== 512 || height !== 512) {
    err(`icon.png must be 512x512 (got ${width ?? '?'}x${height ?? '?'})`);
  }
}

function checkScreenshots(dir, data, err) {
  if (!data || !Array.isArray(data.screenshots)) return;
  const orientations = new Set();
  for (const shot of data.screenshots) {
    if (!shot || typeof shot.file !== 'string') continue;
    const rel = shot.file;
    const path = join(dir, rel);
    if (!existsSync(path)) {
      err(`${rel} is missing`);
      continue;
    }
    const buf = readFileSync(path);
    const format = detectFormat(buf);
    const expected = expectedFormat(rel);
    if (!format) {
      err(`${rel} is not a PNG, JPEG or WebP (magic bytes)`);
      continue;
    }
    if (expected && format !== expected) {
      err(
        `${rel} format is ${formatLabel(format)} but the extension expects ${formatLabel(expected)}`,
      );
    }
    if (buf.length > SCREENSHOT_MAX) {
      err(`${rel} is ${formatBytes(buf.length)} (max 2 MB)`);
    }
    const { width, height } = dimensionsOf(buf);
    if (!width || !height) {
      err(`${rel} dimensions could not be read`);
      continue;
    }
    const shorter = Math.min(width, height);
    const longer = Math.max(width, height);
    if (shorter < 640) {
      err(`${rel} shorter side must be at least 640px (got ${width}x${height})`);
    }
    if (longer > 3000) {
      err(`${rel} longer side must be at most 3000px (got ${width}x${height})`);
    }
    orientations.add(orientation(width, height));
  }
  if (orientations.size > 1) {
    err(`screenshots must share one orientation (found ${[...orientations].sort().join(', ')})`);
  }
}

async function checkUrl(data, offline, err) {
  if (offline) return;
  if (!data || typeof data.url !== 'string') return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), URL_TIMEOUT_MS);
  try {
    const res = await fetch(data.url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'humation-apps-validator (+https://apps.humation.app)' },
    });
    if (res.body) {
      try {
        await res.body.cancel();
      } catch {
        // ignore
      }
    }
    if (res.status >= 400) {
      err(`url returned HTTP ${res.status}`);
    }
  } catch (e) {
    if (e && typeof e === 'object' && 'name' in e && e.name === 'AbortError') {
      err('url did not respond (timeout after 10s)');
    } else {
      const message = e instanceof Error ? e.message : String(e);
      err(`url did not respond (${message})`);
    }
  } finally {
    clearTimeout(timer);
  }
}

function checkDuplicateName(slug, data, names, err) {
  if (!data || typeof data.name !== 'string') return;
  const others = (names.get(data.name.toLowerCase()) ?? []).filter((s) => s !== slug);
  if (others.length > 0) {
    err(
      `name "${data.name}" is already used by ${others.map((s) => `apps/${s}`).join(', ')}`,
    );
  }
}

async function validateListing(slug, { offline, names }) {
  const errors = [];
  const err = (message) => errors.push(`apps/${slug}: ${message}`);
  checkSlug(slug, err);

  const dir = join(APPS_DIR, slug);
  if (!existsSync(dir)) {
    err('directory does not exist');
    return errors;
  }

  const data = checkSchema(dir, err);
  checkDirectory(dir, data, err);
  checkIcon(dir, err);
  checkScreenshots(dir, data, err);
  await checkUrl(data, offline, err);
  checkDuplicateName(slug, data, names, err);
  return errors;
}

async function main() {
  const { offline, targets } = parseArgs(process.argv.slice(2));
  const existing = listAllSlugs();
  const slugs = targets.length > 0 ? targets.map(slugFromArg) : existing;
  const names = collectNames([...new Set([...existing, ...slugs])]);

  let errorCount = 0;
  for (const slug of slugs) {
    const errors = await validateListing(slug, { offline, names });
    if (errors.length === 0) {
      console.log(`ok apps/${slug}`);
    } else {
      for (const line of errors) console.log(line);
      errorCount += errors.length;
    }
  }

  const listingWord = slugs.length === 1 ? 'listing' : 'listings';
  const errorWord = errorCount === 1 ? 'error' : 'errors';
  console.log(`${slugs.length} ${listingWord} validated, ${errorCount} ${errorWord}`);
  process.exitCode = errorCount > 0 ? 1 : 0;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
