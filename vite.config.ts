import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false,
    // The motion layer is the single heaviest dependency. Splitting it out
    // lets the React runtime and the animation code cache independently, so a
    // content-only change does not invalidate both.
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('framer-motion') ||
            id.includes('motion-dom') ||
            id.includes('motion-utils')
          )
            return 'motion';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler'))
            return 'react';
        },
      },
    },
    /* Emit every asset as a file instead of inlining small ones as base64.
     *
     * Vite inlines assets under 4 KB by default, which is usually a good trade:
     * one fewer request for something trivially small. It stopped being a good
     * trade the moment the icon set was optimised - fourteen icons dropped to
     * 2-6 KB each, fell under the threshold together, and base64'd themselves
     * into the entry chunk. Base64 also costs ~33% over the raw bytes, so 36 KB
     * of PNG became roughly 48 KB of JavaScript.
     *
     * That is the wrong place for them. The entry chunk is parsed on every
     * visit and its hash changes on any code edit, so inlined icons are
     * re-downloaded whenever a component changes - while as separate files they
     * are fetched once and cached until the artwork itself changes. Under
     * HTTP/2 the extra requests are close to free; a fatter render-blocking
     * bundle is not.
     *
     * 0 rather than a smaller threshold, so this cannot silently re-trigger the
     * next time an asset happens to land under whatever the limit is. */
    assetsInlineLimit: 0,
    // Fail the build rather than silently shipping a bloated bundle.
    chunkSizeWarningLimit: 350,
  },
});
