import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname, join } from 'path';
import { colletPlugin } from '@colletdev/core/vite-plugin';

/**
 * Fix broken relative paths in @colletdev/core's message_part.js.
 * The generated file uses "../src/" and "../wasm/" prefixes that resolve
 * incorrectly from src/elements/. This plugin rewrites them at resolve time.
 */
function colletPathFix() {
  const coreRoot = resolve(__dirname, 'node_modules/@colletdev/core');
  return {
    name: 'collet-path-fix',
    resolveId(source: string, importer: string | undefined) {
      if (!importer?.includes('@colletdev/core')) return null;
      // ../src/X.js from src/elements/ → src/X.js
      if (source.startsWith('../src/')) {
        return join(coreRoot, 'src', source.replace('../src/', ''));
      }
      // ../wasm/X.js from src/elements/ → wasm/X.js (may not exist, make external)
      if (source.startsWith('../wasm/')) {
        return { id: source, external: true };
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [colletPlugin({ preload: false, prerender: true }), colletPathFix(), react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    // Skip pre-bundling Collet packages — they update locally during docs work
    // and Vite's optimized dep cache can lag behind the installed exports.
    exclude: ['@colletdev/core', '@colletdev/react'],
  },
});
