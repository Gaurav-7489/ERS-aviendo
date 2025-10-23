// vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // ensures correct relative paths in production
  resolve: {
    alias: {
      '@': path.resolve('./src'), // optional, useful for imports
    },
  },
  server: {
    port: 5173,
    open: true, // automatically opens browser on npm run dev
  },
  optimizeDeps: {
    include: ['three', 'gsap'], // fix build issues on Vercel
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
