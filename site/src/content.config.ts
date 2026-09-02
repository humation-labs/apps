import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = [
  'social',
  'games',
  'productivity',
  'developer-tools',
  'education',
  'entertainment',
  'lifestyle',
  'business',
  'other',
] as const;

const platforms = ['web', 'ios', 'android', 'macos', 'windows', 'linux', 'cli'] as const;

const packages = [
  '@humation/react',
  '@humation/core',
  '@humation/web-component',
  '@humation/assets-humation-1',
  'humation-swift',
] as const;

const apps = defineCollection({
  loader: glob({
    base: '../apps',
    pattern: '*/app.json',
    generateId: ({ entry }) => entry.replace(/\/app\.json$/, ''),
  }),
  schema: z.object({
    $schema: z.string().optional(),
    name: z.string().min(1).max(40),
    tagline: z.string().min(1).max(80),
    description: z.string().min(40).max(1200),
    url: z.string().url().regex(/^https:\/\//),
    category: z.enum(categories),
    platforms: z.array(z.enum(platforms)).min(1),
    pricing: z.enum(['free', 'freemium', 'paid']),
    humation: z.object({
      packages: z.array(z.enum(packages)).min(1),
      usage: z.string().max(200).optional(),
    }),
    developer: z.object({
      name: z.string().min(1).max(60),
      github: z.string().regex(/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/),
      url: z.string().url().regex(/^https:\/\//).optional(),
    }),
    icon: z.literal('icon.png'),
    screenshots: z
      .array(
        z.object({
          file: z.string().regex(/^screenshots\/[a-z0-9-]+\.(png|jpg|jpeg|webp)$/),
          alt: z.string().min(5).max(140),
        }),
      )
      .min(1)
      .max(5),
    links: z
      .object({
        repo: z.string().url().optional(),
        appStore: z.string().url().optional(),
        playStore: z.string().url().optional(),
        x: z.string().url().optional(),
        discord: z.string().url().optional(),
      })
      .optional(),
    addedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

export const collections = { apps };
