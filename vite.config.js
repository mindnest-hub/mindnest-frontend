import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.jpg', 'nest_logo.png'],
      workbox: {
        // Cache pages and assets for offline use
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            // API calls: Network first, fall back to cache
            urlPattern: /^https:\/\/african-edu-backend\.onrender\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'mindnest-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }, // 24h
              networkTimeoutSeconds: 10,
            }
          },
          {
            // Images and static assets: Cache first
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mindnest-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            }
          }
        ]
      },
      manifest: {
        name: 'MindNest Africa Elite',
        short_name: 'MindNest',
        description: 'Learn. Grow. Earn. The #1 Elite Learning Ecosystem for Africa.',
        theme_color: '#C5A019',
        background_color: '#050505',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        id: 'bond.mindnest.app',
        categories: ['education', 'finance', 'productivity'],
        shortcuts: [
          {
            name: 'My Dashboard',
            url: '/',
            description: 'View your MindNest Elite Dashboard',
            icons: [{ src: '/nest_logo.png', sizes: '192x192' }]
          },
          {
            name: 'Elite Community',
            url: '/#/community',
            description: 'Join the Elite community feed',
            icons: [{ src: '/nest_logo.png', sizes: '192x192' }]
          },
          {
            name: 'My Earnings',
            url: '/#/services',
            description: 'View and withdraw your earnings',
            icons: [{ src: '/nest_logo.png', sizes: '192x192' }]
          }
        ],
        icons: [
          { src: 'nest_logo.png', sizes: '192x192', type: 'image/png' },
          { src: 'nest_logo.png', sizes: '512x512', type: 'image/png' },
          { src: 'nest_logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  base: '/', // Fixes Vercel 404 (root access)
  server: {
    host: true, // Exposes to network (fixes phone access)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI utilities
          'vendor-ui': ['html2canvas', 'dompurify'],
          // Education modules (Finance + Critical Thinking)
          'pages-education': [
            './src/pages/Finance.jsx',
            './src/pages/CriticalThinking.jsx'
          ],
          // Community modules (History + Agri)
          'pages-community': [
            './src/pages/History.jsx',
            './src/pages/Agripreneurship.jsx'
          ],
          // Other modules
          'pages-other': [
            './src/pages/Tech.jsx',
            './src/pages/Civics.jsx',
            './src/pages/Health.jsx',
            './src/pages/Transparency.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 600 // Increase limit to 600KB (from default 500KB)
  }
})
