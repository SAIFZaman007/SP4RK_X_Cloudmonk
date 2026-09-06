/**
 * Fills in the `author` field of every entry in `iconCredits` (src/data.ts) by
 * reading it off the icon's own Flaticon page.
 *
 * Why this exists
 * ---------------
 * The Flaticon Free License permits commercial use only with visible credit to
 * each icon's author. Fourteen icons means fourteen author names, and the
 * manual version of this job - open each page, find the name under the
 * preview, paste it into the right line - is exactly the kind of tedium that
 * gets half-done once and never revisited. A credit that is 70% complete is
 * not a lesser form of compliance; it is non-compliance with extra steps.
 *
 * So the name is derived from the artwork's own page rather than transcribed.
 * Swap an icon, update its `url`, re-run this, and the credit follows the file
 * instead of drifting away from it.
 *
 * How it reads the name
 * ---------------------
 * Flaticon renders the author into the page's og:title as
 * "<Icon name> free icons designed by <Author>". That tag is server-rendered,
 * so it is present in the raw HTML - no headless browser, no API key. The
 * visible byline further down the page is injected client-side and would not
 * be, which is why this reads the meta tag and not the markup a human sees.
 *
 * Run: npm run icons:credits
 * Idempotent, and only ever fills blanks unless --force is passed, so a name
 * you corrected by hand is not overwritten by a scrape.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA = resolve(process.cwd(), 'src/data.ts');
const FORCE = process.argv.includes('--force');

/* A default fetch sends no User-Agent that looks like a browser, and Flaticon
   answers those with a challenge page that has no og:title in it. */
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/** Pulls `{ file, url, author }` out of each item line in the credits block. */
function parseItems(source) {
  const block = source.slice(
    source.indexOf('export const iconCredits'),
    source.indexOf('/* Name variants.')
  );

  return [...block.matchAll(/\{\s*file: '([^']+)'[^}]*?url: '([^']+)'[^}]*?author: '([^']*)'\s*\}/g)].map(
    ([, file, url, author]) => ({ file, url, author })
  );
}

/** "AI free icons designed by Good Ware" -> "Good Ware" */
function authorFromHtml(html) {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const title = og?.[1] ?? html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
  const m = title.match(/designed by\s+(.+?)\s*$/i);
  return m ? m[1].trim() : null;
}

const source = readFileSync(DATA, 'utf8');
const items = parseItems(source);

if (items.length === 0) {
  console.error('[credits] could not parse any items out of src/data.ts');
  process.exit(1);
}

const todo = items.filter((i) => FORCE || !i.author);

if (todo.length === 0) {
  console.log(`[credits] all ${items.length} authors already filled - nothing to do`);
  process.exit(0);
}

console.log(`[credits] resolving ${todo.length} of ${items.length} authors...`);

const resolved = new Map();
const failed = [];

for (const item of todo) {
  try {
    const res = await fetch(item.url, { headers: HEADERS, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const author = authorFromHtml(await res.text());
    if (!author) throw new Error('no "designed by" in og:title');

    resolved.set(item.file, author);
    console.log(`  ${item.file.padEnd(28)} ${author}`);
  } catch (err) {
    failed.push(`  ${item.file}: ${err.message}`);
  }

  /* Courtesy delay. This is a handful of requests to someone else's server for
     the purpose of crediting their contributors properly; there is no reason
     to issue them as fast as the event loop allows. */
  await new Promise((r) => setTimeout(r, 700));
}

let out = source;
for (const [file, author] of resolved) {
  const safe = author.replace(/'/g, "\\'");
  out = out.replace(
    new RegExp(`(\\{\\s*file: '${file}',[^}]*?author: ')[^']*(')`),
    `$1${safe}$2`
  );
}

if (out !== source) {
  writeFileSync(DATA, out);
  console.log(`[credits] wrote ${resolved.size} author(s) into src/data.ts`);
} else {
  console.log('[credits] no changes written');
}

if (failed.length) {
  console.error(
    `[credits] ${failed.length} could not be resolved - fill these by hand ` +
      `(the name is under the preview on each icon's page):\n${failed.join('\n')}`
  );
  process.exit(1);
}
