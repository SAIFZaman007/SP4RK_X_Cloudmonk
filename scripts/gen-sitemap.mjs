/** Regenerates dist/sitemap.xml with today's date so lastmod never goes stale. */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ORIGIN = 'https://cloudmonk.cc';
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync(resolve(process.cwd(), 'dist', 'sitemap.xml'), xml);
console.log(`[sitemap] written with lastmod ${today}`);
