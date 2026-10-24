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
          // three.js backs the About-section badge and is only ever reached
          // through a dynamic import (see LanyardBadge), so naming the chunk
          // keeps it a stable, separately cacheable file that never joins the
          // entry or the shared vendor chunks.
          if (id.includes('/node_modules/three/')) return 'three';
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
    // Flag a bloated bundle rather than silently shipping it.
    //
    // 350 -> 600 for one reason: the `three` chunk (~515 KB raw, ~130 KB gzip).
    // It is reachable only through a dynamic import (LanyardBadge) and is not
    // preloaded, so it costs the initial load nothing - but it is larger than
    // the old limit, and a build that always warns trains everyone to ignore
    // the warning. Every eagerly loaded chunk (entry, react, motion) is still
    // under 250 KB, so the headroom to 600 is not one a regression there would
    // quietly use up; revisit if any eager chunk crosses 350.
    chunkSizeWarningLimit: 600,
  },
});
