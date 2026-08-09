/**
 * Computes the CSP sha256 hash for the inline JSON-LD block in the BUILT
 * index.html, then rewrites the hash inside dist/_headers.
 *
 * It reads from dist/ (not the source) deliberately: the hash must cover the
 * exact bytes the browser sees, and a bundler is free to reformat inline
 * blocks on the way through.
 *
 * Run automatically by `npm run build`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const htmlPath = resolve(dist, 'index.html');
const headersPath = resolve(dist, '_headers');

if (!existsSync(htmlPath)) {
  console.error('[csp-hash] dist/index.html not found - run `vite build` first.');
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');
const blocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(
  (m) => m[1]
);

if (blocks.length === 0) {
  console.log('[csp-hash] no inline scripts found - nothing to hash.');
  process.exit(0);
}

const hashes = blocks.map(
  (body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`
);

console.log(`[csp-hash] ${blocks.length} inline script block(s):`);
hashes.forEach((h) => console.log(`  ${h}`));

if (existsSync(headersPath)) {
  const headers = readFileSync(headersPath, 'utf8');
  const patched = headers.replace(/__INLINE_SCRIPT_HASHES__/g, hashes.join(' '));
  writeFileSync(headersPath, patched);
  console.log('[csp-hash] dist/_headers patched.');
} else {
  console.warn('[csp-hash] dist/_headers not found - is public/_headers present?');
}
