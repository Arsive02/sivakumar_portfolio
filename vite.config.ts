import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import glsl from 'vite-plugin-glsl'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    glsl({ compress: mode === 'production' }),
    mode === 'analyze' && visualizer({ filename: 'dist/stats.html', gzipSize: true }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 800, // three.js is ~750 kB raw / 190 kB gz and only loads after idle
    rollupOptions: {
      output: {
        // three.js / R3F are deliberately NOT forced into manual chunks: they're only reachable
        // through lazy imports, and forcing them makes Rollup park shared helpers there, which
        // turns them into eager (preloaded) dependencies of the entry.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react-router', 'scheduler'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
}))
