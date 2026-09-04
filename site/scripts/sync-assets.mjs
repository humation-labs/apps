#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';
import { PNG } from 'pngjs';

const SITE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = join(SITE_ROOT, '..');
const APPS_SRC = join(REPO_ROOT, 'apps');
const APPS_DEST = join(SITE_ROOT, 'public', 'apps');
const PUBLIC = join(SITE_ROOT, 'public');
const GENERATED_DIR = join(SITE_ROOT, 'src', 'generated');

if (existsSync(APPS_DEST)) rmSync(APPS_DEST, { recursive: true, force: true });
mkdirSync(APPS_DEST, { recursive: true });

/** @type {Record<string, Record<string, { width: number; height: number; color?: string }>>} */
const catalog = {};

/**
 * Average opaque, non-white, non-black pixels, then boost saturation and clamp lightness.
 * @param {Buffer} buf
 * @returns {string | undefined}
 */
function brandColorFromPng(buf) {
  const png = PNG.sync.read(buf);
  const { data } = png;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a <= 200) continue;
    if (r > 240 && g > 240 && b > 240) continue;
    if (r < 20 && g < 20 && b < 20) continue;
    rSum += r;
    gSum += g;
    bSum += b;
    count++;
  }
  if (count === 0) return undefined;
  const { h, s, l } = rgbToHsl(rSum / count, gSum / count, bSum / count);
  const { r, g, b } = hslToRgb(h, Math.min(1, s * 1.15), Math.min(0.55, Math.max(0.3, l)));
  return `#${hexByte(r)}${hexByte(g)}${hexByte(b)}`;
}

/** @param {number} n */
function hexByte(n) {
  return Math.round(n).toString(16).padStart(2, '0');
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h, s, l };
}

/**
 * @param {number} h
 * @param {number} s
 * @param {number} l
 */
function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}

if (existsSync(APPS_SRC)) {
  for (const entry of readdirSync(APPS_SRC, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = join(APPS_SRC, entry.name);
    const dest = join(APPS_DEST, entry.name);
    mkdirSync(join(dest, 'screenshots'), { recursive: true });
    /** @type {Record<string, { width: number; height: number; color?: string }>} */
    const files = {};
    const icon = join(src, 'icon.png');
    if (existsSync(icon)) {
      const destIcon = join(dest, 'icon.png');
      cpSync(icon, destIcon);
      const buf = readFileSync(destIcon);
      const size = imageSize(buf);
      /** @type {{ width: number; height: number; color?: string }} */
      const iconEntry = { width: size.width, height: size.height };
      try {
        const color = brandColorFromPng(buf);
        if (color) iconEntry.color = color;
      } catch {
        // omit color if decoding fails
      }
      files['icon.png'] = iconEntry;
    }
    const shots = join(src, 'screenshots');
    if (existsSync(shots)) {
      for (const file of readdirSync(shots, { withFileTypes: true })) {
        if (file.isFile()) {
          const destShot = join(dest, 'screenshots', file.name);
          cpSync(join(shots, file.name), destShot);
          const size = imageSize(readFileSync(destShot));
          files[`screenshots/${file.name}`] = { width: size.width, height: size.height };
        }
      }
    }
    if (Object.keys(files).length > 0) {
      catalog[entry.name] = files;
    }
  }
}

mkdirSync(GENERATED_DIR, { recursive: true });
writeFileSync(join(GENERATED_DIR, 'images.json'), JSON.stringify(catalog, null, 2) + '\n');

mkdirSync(join(PUBLIC, 'schema'), { recursive: true });
cpSync(join(REPO_ROOT, 'llms.txt'), join(PUBLIC, 'llms.txt'));
cpSync(join(REPO_ROOT, 'schema', 'app.schema.json'), join(PUBLIC, 'schema', 'app.schema.json'));

const GITHUB_JSON = join(GENERATED_DIR, 'github.json');
const GITHUB_FALLBACK_FILE = join(SITE_ROOT, 'src', 'data', 'github-stars.json');
const GITHUB_NULL = {
  repo: 'humation-labs/humation',
  stars: null,
  fetchedAt: null,
};

const NPM_PACKAGE = '@humation/core';
const NPM_SINCE = '2026-06-01';
const NPM_JSON = join(GENERATED_DIR, 'npm.json');
const NPM_FALLBACK_FILE = join(SITE_ROOT, 'src', 'data', 'npm-downloads.json');
const NPM_NULL = {
  package: NPM_PACKAGE,
  downloads: null,
  since: NPM_SINCE,
  fetchedAt: null,
};

function writeGithubJson(payload) {
  writeFileSync(GITHUB_JSON, JSON.stringify(payload, null, 2) + '\n');
}

async function syncGithubStars() {
  try {
    /** @type {Record<string, string>} */
    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'humation-apps-build',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let res;
    try {
      res = await fetch('https://api.github.com/repos/humation-labs/humation', {
        headers,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (typeof body.stargazers_count !== 'number') {
      throw new Error('missing stargazers_count');
    }
    const payload = {
      repo: 'humation-labs/humation',
      stars: body.stargazers_count,
      fetchedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(payload, null, 2) + '\n';
    writeFileSync(GITHUB_JSON, json);
    writeFileSync(GITHUB_FALLBACK_FILE, json);
    console.log(`github: ${payload.stars} stars (humation-labs/humation)`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    try {
      const raw = readFileSync(GITHUB_FALLBACK_FILE, 'utf8');
      const fallback = JSON.parse(raw);
      writeFileSync(GITHUB_JSON, raw.endsWith('\n') ? raw : `${raw}\n`);
      console.log(`github: using fallback (${fallback.stars} stars from ${fallback.fetchedAt})`);
    } catch {
      writeGithubJson(GITHUB_NULL);
      console.log(`github: wrote null github.json (${reason})`);
    }
  }
}

function writeNpmJson(payload) {
  writeFileSync(NPM_JSON, JSON.stringify(payload, null, 2) + '\n');
}

/** @param {string} ymd */
function parseUtcYmd(ymd) {
  return new Date(`${ymd}T00:00:00.000Z`);
}

/** @param {Date} d */
function utcYmd(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * @param {string} ymd
 * @param {number} days
 */
function addDaysYmd(ymd, days) {
  const d = parseUtcYmd(ymd);
  d.setUTCDate(d.getUTCDate() + days);
  return utcYmd(d);
}

async function syncNpmDownloads() {
  try {
    const today = utcYmd(new Date());
    let start = NPM_SINCE;
    let downloads = 0;
    while (start <= today) {
      const windowEnd = addDaysYmd(start, 539);
      const end = windowEnd <= today ? windowEnd : today;
      const url = `https://api.npmjs.org/downloads/range/${start}:${end}/${NPM_PACKAGE}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      let res;
      try {
        res = await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (!Array.isArray(body.downloads)) {
        throw new Error('missing downloads array');
      }
      downloads += body.downloads.reduce((a, d) => a + d.downloads, 0);
      start = addDaysYmd(end, 1);
    }
    const payload = {
      package: NPM_PACKAGE,
      downloads,
      since: NPM_SINCE,
      fetchedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(payload, null, 2) + '\n';
    writeFileSync(NPM_JSON, json);
    writeFileSync(NPM_FALLBACK_FILE, json);
    console.log(`npm: ${payload.downloads} downloads (@humation/core since 2026-06-01)`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    try {
      const raw = readFileSync(NPM_FALLBACK_FILE, 'utf8');
      const fallback = JSON.parse(raw);
      writeFileSync(NPM_JSON, raw.endsWith('\n') ? raw : `${raw}\n`);
      console.log(`npm: using fallback (${fallback.downloads} downloads from ${fallback.fetchedAt})`);
    } catch {
      writeNpmJson(NPM_NULL);
      console.log(`npm: wrote null npm.json (${reason})`);
    }
  }
}

await syncGithubStars();
await syncNpmDownloads();
