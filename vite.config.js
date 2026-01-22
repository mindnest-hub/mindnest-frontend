import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'African Renaissance App',
        short_name: 'AfricanEdu',
        description: 'Reclaiming our past. Building our future.',
        theme_color: '#FFD700',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: './', // Fixes file:// access (blank screen on PC)
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
