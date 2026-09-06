/**
 * Refuses to build a bundle whose icon assets, wiring or licensing are wrong.
 *
 * The icon set is PNG (Flaticon gates SVG behind a paid plan) and is rendered
 * through a CSS mask so it can still take the gold accent - see the long note
 * in src/components/icons.tsx. That technique has one hard prerequisite: the
 * PNG must carry a real alpha channel. A PNG saved without one is not a
 * degraded icon, it is a solid rectangle of colour where a glyph should be, and
 * nothing about the build would otherwise complain.
 *
 * Checks, in order of how quietly they fail without this:
 *
 *   1. Every icon PNG has an alpha channel (colour type 4 or 6). Without it a
 *      masked icon renders as a filled block.
 *   2. Registry, credits list and files on disk all agree - no icon rendered
 *      that nothing credits, no credit naming a file that is gone.
 *   3. Every shipped icon has an author credited. Flaticon's Free License makes
 *      attribution a condition of use, and the footer renders from that list,
 *      so a blank author does not look broken - it just silently puts the site
 *      out of licence.
 *   4. Weight and dimensions are sane for a glyph drawn at 32px.
 *
 * Runs as part of `npm run build`. Alone: npm run icons:verify
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();
const DATA = resolve(ROOT, 'src/data.ts');
const REGISTRY = resolve(ROOT, 'src/components/icons.tsx');
const ICON_DIR = resolve(ROOT, 'src/assets/icons');

const data = readFileSync(DATA, 'utf8');
const registry = readFileSync(REGISTRY, 'utf8');

const creditsBlock = data.slice(
  data.indexOf('export const iconCredits'),
  data.indexOf('/* Name variants.')
);
const required = /required:\s*true/.test(creditsBlock);
const credits = [
  ...creditsBlock.matchAll(/\{\s*file: '([^']+)'[^}]*?label: '([^']*)'[^}]*?author: '([^']*)'\s*\}/g),
].map(([, file, label, author]) => ({ file, label, author }));

/* Which PNGs the registry actually imports - read from the import statements
   so it cannot drift from a second hand-maintained list. */
const imported = new Set(
  [...registry.matchAll(/from '\.\.\/assets\/icons\/([^']+)\.png'/g)].map(([, n]) => n)
);
/* Icons deliberately opted out of masking because their artwork is full colour.
   Registry keys may be quoted ('group-trip') or bare (landmark), so both forms
   are matched rather than assuming the quoted one. */
const asImage = new Set(
  [...registry.matchAll(/(?:'([\w-]+)'|(\w+)):\s*\{[^}]*?render:\s*'image'/g)].map(
    ([, quoted, bare]) => quoted ?? bare
  )
);

/**
 * Reads width, height and colour type straight out of the IHDR chunk.
 * A PNG is an 8-byte signature followed immediately by IHDR, so the fields sit
 * at fixed offsets - no image library needed for what amounts to a header peek.
 */
function pngHeader(buf) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(SIG)) return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    // 0 grey, 2 RGB, 3 palette, 4 grey+alpha, 6 RGBA
    colorType: buf.readUInt8(25),
  };
}

const errors = [];
const warnings = [];

if (credits.length === 0) errors.push('no credit entries could be parsed from src/data.ts');

/* 1 - alpha channel */
for (const file of readdirSync(ICON_DIR).filter((f) => f.endsWith('.png'))) {
  const name = file.replace(/\.png$/, '');
  const buf = readFileSync(join(ICON_DIR, file));
  const h = pngHeader(buf);

  if (!h) {
    errors.push(`${file} is not a valid PNG`);
    continue;
  }
  // Palette PNGs (type 3) can carry alpha via a tRNS chunk, so check for that
  // rather than rejecting them outright.
  const hasAlpha = h.colorType === 4 || h.colorType === 6 || (h.colorType === 3 && buf.includes('tRNS'));
  if (!hasAlpha && !asImage.has(name)) {
    errors.push(
      `${file} has no alpha channel (PNG colour type ${h.colorType}).\n` +
        `        A masked icon needs transparency or it renders as a solid block.\n` +
        `        Re-download it as a transparent PNG.`
    );
  }
  if (h.width !== h.height) {
    warnings.push(`  ${file} is ${h.width}x${h.height}, not square - it may sit off-centre`);
  }
  const kb = statSync(join(ICON_DIR, file)).size / 1024;
  if (kb > 60) warnings.push(`  ${file} is ${kb.toFixed(0)} KB - large for a 32px glyph`);
}

/* 2 - registry <-> credits <-> disk */
for (const name of imported) {
  if (!credits.some((c) => c.file === name)) {
    errors.push(`icon "${name}" is imported by the registry but has no credit entry`);
  }
}
for (const c of credits) {
  if (!imported.has(c.file)) errors.push(`credit entry "${c.file}" is not imported by the registry`);
  if (!existsSync(join(ICON_DIR, `${c.file}.png`))) {
    errors.push(`credit entry "${c.file}" has no matching PNG in src/assets/icons/`);
  }
}

/* 3 - licensing */
if (required) {
  const uncredited = credits.filter((c) => !c.author.trim());
  if (uncredited.length) {
    errors.push(
      `${uncredited.length} icon(s) have no author credited, but iconCredits.required is true.\n` +
        `        Run \`npm run icons:credits\` to resolve them automatically:\n` +
        uncredited.map((c) => `          - ${c.file} (${c.label})`).join('\n')
    );
  }
}

if (asImage.size) {
  warnings.push(
    `  ${asImage.size} icon(s) render as full-colour images rather than gold glyphs ` +
      `(${[...asImage].join(', ')}) - re-download these in a lineal/outline style for a consistent set`
  );
}

if (warnings.length) console.warn(`[icons] notes:\n${warnings.join('\n')}`);
if (errors.length) {
  console.error(`[icons] verification failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`[icons] verified: ${credits.length} icons, all credited, registry and files agree`);
