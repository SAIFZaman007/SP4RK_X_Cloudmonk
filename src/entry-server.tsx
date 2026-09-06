import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Server entry, used only at build time by scripts/prerender.mjs.
 *
 * This exists so the HTML that leaves the server already contains the page.
 * A Vite SPA ships `<div id="root"></div>` and nothing else: Googlebot will
 * execute the bundle and eventually see the content, but most AI crawlers -
 * GPTBot, ClaudeBot, PerplexityBot and the long tail of retrieval agents -
 * fetch raw HTML and never run JavaScript. To those clients an unprerendered
 * SPA is a blank page, no matter how good its structured data is.
 *
 * Rendering once at build time fixes that without adding a server: the output
 * is still a static bundle on a CDN.
 */
export function render() {
  return renderToString(<App />);
}
