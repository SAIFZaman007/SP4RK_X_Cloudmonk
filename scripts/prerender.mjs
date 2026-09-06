/**
 * Renders the app once at build time and injects the result into
 * dist/index.html, so the deployed HTML contains the page rather than an
 * empty mount point.
 *
 * Why this is worth a build step:
 *   - Most AI and answer-engine crawlers do not execute JavaScript. An SPA is
 *     a blank document to them, so none of the copy, project list or headings
 *     are retrievable no matter how complete the JSON-LD is.
 *   - It removes the blank-screen gap before the bundle parses, which is the
 *     largest single contributor to LCP on a cold, throttled connection.
 *   - It costs nothing at runtime. The output is still static files.
 *
 * Runs after `vite build` and before `csp-hash`, because it changes the bytes
 * of index.html and the CSP hash has to cover the final version.
 */
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const htmlPath = resolve(root, 'dist/index.html');
const serverEntry = resolve(root, 'dist-ssr/entry-server.js');

if (!existsSync(htmlPath)) {
  console.error('[prerender] dist/index.html not found - run `vite build` first.');
  process.exit(1);
}
if (!existsSync(serverEntry)) {
  console.error('[prerender] dist-ssr/entry-server.js not found - run the SSR build first.');
  process.exit(1);
}

const { render } = await import(pathToFileURL(serverEntry).href);

let appHtml;
try {
  appHtml = render();
} catch (err) {
  // A failed prerender must not produce a half-written page. Leaving
  // dist/index.html as the plain SPA shell is a degraded result but a working
  // one; writing partial markup is a broken one.
  console.error('[prerender] render threw - leaving dist/index.html as the SPA shell.');
  console.error(err);
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');

// Anchored on the exact empty-root markup. A loose match risks injecting into
// the wrong element after an unrelated edit to index.html, and failing loudly
// here is cheaper than shipping a page with two roots.
const MOUNT = '<div id="root"></div>';
if (!html.includes(MOUNT)) {
  console.error(`[prerender] could not find \`${MOUNT}\` in dist/index.html.`);
  process.exit(1);
}

writeFileSync(htmlPath, html.replace(MOUNT, `<div id="root">${appHtml}</div>`));

// The SSR bundle is a build artefact, not something to deploy.
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });

const kb = (Buffer.byteLength(appHtml, 'utf8') / 1024).toFixed(1);
console.log(`[prerender] injected ${kb} KB of static markup into dist/index.html`);
