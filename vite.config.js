import { defineConfig } from 'vite'

export default defineConfig({
  // Base URL for deployment
  base: '/',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js'],
        },
      },
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'User-Agent': 'CryptoDash/1.0'
        }
      }
    }
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
