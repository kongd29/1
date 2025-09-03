import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        versionA: resolve(__dirname, 'version-a.html'),
        versionB: resolve(__dirname, 'version-b.html'),
      },
    },
  },
});
