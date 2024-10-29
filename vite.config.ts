import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Sentry',
      formats: ['es', 'cjs', 'iife'],
      fileName: format => `${format}/index.js`
    },
    sourcemap: true,
    rollupOptions: {
      external: ['@system.fetch', '@system.prompt']
    }
  }
})
