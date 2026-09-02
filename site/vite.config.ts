import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
        { path: '/search' },
        { path: '/404', prerender: { enabled: true, outputPath: '/404.html' } },
      ],
    }),
    viteReact(),
  ],
})
