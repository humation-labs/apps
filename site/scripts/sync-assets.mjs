#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const SITE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = join(SITE_ROOT, '..');
const APPS_SRC = join(REPO_ROOT, 'apps');
const APPS_DEST = join(SITE_ROOT, 'public', 'apps');
const PUBLIC = join(SITE_ROOT, 'public');
const GENERATED_DIR = join(SITE_ROOT, 'src', 'generated');

if (existsSync(APPS_DEST)) rmSync(APPS_DEST, { recursive: true, force: true });
mkdirSync(APPS_DEST, { recursive: true });

/** @type {Record<string, Record<string, { width: number; height: number }>>} */
const catalog = {};

if (existsSync(APPS_SRC)) {
  for (const entry of readdirSync(APPS_SRC, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = join(APPS_SRC, entry.name);
    const dest = join(APPS_DEST, entry.name);
    mkdirSync(join(dest, 'screenshots'), { recursive: true });
    /** @type {Record<string, { width: number; height: number }>} */
    const files = {};
    const icon = join(src, 'icon.png');
    if (existsSync(icon)) {
      const destIcon = join(dest, 'icon.png');
      cpSync(icon, destIcon);
      const size = imageSize(readFileSync(destIcon));
      files['icon.png'] = { width: size.width, height: size.height };
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
const GITHUB_FALLBACK = {
  repo: 'humation-labs/humation',
  stars: null,
  fetchedAt: null,
};

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
    writeFileSync(GITHUB_JSON, JSON.stringify(payload, null, 2) + '\n');
    console.log(`github: ${payload.stars} stars (humation-labs/humation)`);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    if (existsSync(GITHUB_JSON)) {
      console.log(`github: kept existing github.json (${reason})`);
    } else {
      writeFileSync(GITHUB_JSON, JSON.stringify(GITHUB_FALLBACK, null, 2) + '\n');
      console.log(`github: wrote fallback github.json (${reason})`);
    }
  }
}

await syncGithubStars();
