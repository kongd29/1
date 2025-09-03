// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  optimizeDeps: {
    exclude: ['seed-supabase.js', 'scripts/seed-supabase.js'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['seed-supabase.js', 'scripts/seed-supabase.js'],
      input: {
        index: resolve(__dirname, 'index.html'),
        versionA: resolve(__dirname, 'version-a.html'),
        versionB: resolve(__dirname, 'version-b.html'),
      },
    },
  },
});
