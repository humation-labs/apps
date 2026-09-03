import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gaId = env.VITE_GA_ID
  // A numeric property id (not a G- measurement id) would silently break tracking, so fail the build.
  if (gaId && !/^G-[A-Z0-9]+$/.test(gaId)) {
    throw new Error(`VITE_GA_ID "${gaId}" is not a GA4 measurement ID (expected G-XXXXXXXXXX)`)
  }

  return {
    server: {
      port: 4321,
      fs: {
        allow: ['..'],
      },
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        srcDirectory: 'src',
        prerender: {
          enabled: true,
          crawlLinks: true,
          autoSubfolderIndex: true,
          failOnError: true,
        },
        pages: [
          { path: '/' },
          { path: '/new' },
          { path: '/search' },
          { path: '/404', prerender: { enabled: true, outputPath: '/404.html' } },
          { path: '/ja' },
          { path: '/ja/new' },
          { path: '/ja/search' },
          { path: '/ja/404', prerender: { enabled: true, outputPath: '/ja/404.html' } },
        ],
      }),
      viteReact(),
    ],
  }
})
