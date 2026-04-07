import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.svg', 'robots.txt'],
      
      manifest: {
        name: 'TrustBridge AI',
        short_name: 'TrustBridge',
        description: 'AI-Powered Business Collaboration & Investment Platform',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/',
        start_url: '/login',
        orientation: 'portrait',
        icons: [
          {
            src: '/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit for large assets
        runtimeCaching: [
          // Cache API requests
          {
            urlPattern: ({ url }) => {
              const apiRoutes = [
                '/auth',
                '/user',
                '/entrepreneur',
                '/investor',
                '/campaign',
                '/deal',
                '/admin',
                '/message',
                '/conversation',
                '/industry',
                '/document',
                '/contact',
                '/payment',
                '/agora',
                '/requests' // collaborationRouter
              ];
              // Match if the pathname starts with any of the API routes
              return apiRoutes.some(route => url.pathname.startsWith(route));
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Cache Images (like user avatars, campaign images)
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          // Cache Google Fonts / External Fonts (Inter font from rsms.me)
          {
            urlPattern: ({ url }) => url.origin === 'https://rsms.me',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
              }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
})
