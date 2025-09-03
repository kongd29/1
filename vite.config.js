// vite.config.js
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // seed 스크립트가 번들에 끌려오지 않도록 이중 차단(안전장치)
  optimizeDeps: {
    exclude: ['seed-supabase.js', 'scripts/seed-supabase.js'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['seed-supabase.js', 'scripts/seed-supabase.js'],
      // ✅ HTML 엔트리를 명시 (index + A + B)
      input: {
        index: path.resolve(__dirname, 'index.html'),
        versionA: path.resolve(__dirname, 'version-a.html'),
        versionB: path.resolve(__dirname, 'version-b.html'),
      },
    },
  },
});
