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
    // Fail the build rather than silently shipping a bloated bundle.
    chunkSizeWarningLimit: 350,
  },
});
