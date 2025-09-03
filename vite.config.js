// vite.config.js  ← 프로젝트 루트에 있는 이 파일을 그대로 교체하세요.
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 혹시 누가 import 하더라도 번들에 끌려오지 않도록 안전장치
  optimizeDeps: {
    exclude: ['seed-supabase.js', 'scripts/seed-supabase.js'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // 브라우저에서 쓸 파일이 아니니 번들 대상에서 완전히 제외
      external: ['seed-supabase.js', 'scripts/seed-supabase.js'],
      // 여러 HTML 엔트리(네 프로젝트의 실제 파일들) 지정
      input: {
        index: resolve(__dirname, 'index.html'),
        versionA: resolve(__dirname, 'version-a.html'),
        versionB: resolve(__dirname, 'version-b.html'),
      },
    },
  },
});
