import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png', 'fonts/*.woff2'],
      manifest: {
        name: 'Bundestag Wrapped 2025',
        short_name: 'BT Wrapped',
        description: 'Entdecke die Sprache des Bundestags: Interaktive Statistiken zur 21. Wahlperiode.',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'de',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache static JSON data files
        runtimeCaching: [
          {
            urlPattern: /\/wrapped\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wrapped-data',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
          {
            urlPattern: /\/speakers\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'speaker-data',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
          {
            urlPattern: /\/speeches_db\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'speeches-data',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
          {
            urlPattern: /\/words_index\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'words-data',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
          {
            urlPattern: /\/fonts\/.*\.woff2$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
        // Pre-cache critical assets
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Don't pre-cache large JSON files (they'll be runtime cached)
        globIgnores: ['**/speeches_*.json', '**/words_index.json'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
