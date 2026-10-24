# cloudmonk.cc — Saif Zaman

Personal portfolio for **Md. Saifuzzaman Naim** (Saif Zaman), AI-SaaS Engineer.
Static single-page site, deployed to **Cloudflare Pages** at `cloudmonk.cc`.

React 19 · TypeScript · Tailwind 4 · Vite 8 · Framer Motion · zero backend

---

## Quick start

```bash
npm ci          # Node >= 20.19 - installs exactly what package-lock.json pins
npm audit       # 0 vulnerabilities
npm run dev     # http://localhost:5173
```

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Dev server with HMR                                       |
| `npm run build`     | Typecheck → bundle → regenerate sitemap → inject CSP hash |
| `npm run preview`   | Serve `dist/` locally, exactly as deployed                |
| `npm run typecheck` | `tsc -b --noEmit`                                         |
| `npm run lint`      | ESLint                                                    |
| `npm run format`    | Prettier, write                                           |
| `npm run verify`    | typecheck + lint + build — run this before pushing        |

---

## Editing content

**Everything you will normally change lives in one file: `src/data.ts`.**
No component hardcodes copy. Change the data, the page follows.

```
site         name, role, domain, email, CV path, social links
hero         headline, subtitle, the three stat counters, tool marquee
about        badge artwork paths (front/back/band), quick facts, bio paragraphs
services     the four cards that drive the hero deck animation
projects     selected work — add `url` to render a "Live ↗" link
experience   roles, in reverse-chronological order
skills       four categories, four items each
testimonials real people, real quotes only (see below)
education    degrees
```

Search the file for **`[CONFIRM]`** — those are values that were inferred and
need your sign-off before launch.

### Testimonials will not render until they are real

`testimonials[].quote` ships empty on purpose. The names in that list are real,
identifiable people; putting invented words in their mouths would be
fabricated social proof, and it is trivially checkable.

`Testimonials.tsx` filters out any entry with an empty quote and returns `null`
if fewer than `MIN_TESTIMONIALS` (3) remain — so a half-filled carousel can
never reach production. Collect 2–3 sentences from each person, paste them in,
and the section appears by itself.

### Swapping the CV

Drop the PDF at `public/media/Saif_Zaman_CV.pdf`, or change `site.cvLink`.

---

## Design system

Dark-first. The palette was extracted from the portrait photograph by k-means
clustering, not picked by eye:

| Token             | Hex       | Source                                                         |
| ----------------- | --------- | -------------------------------------------------------------- |
| `coal-900` / page | `#0B080C` | 33% of the portrait frame                                      |
| `surface`         | `#18121A` | second-dominant tone                                           |
| `crimson.DEFAULT` | `#DF3640` | lifted off the `#741B3A` maroon shirt                          |
| `crimson.light`   | `#F4737B` | accent **text** — the DEFAULT is too dark for AA on near-black |
| `steel.DEFAULT`   | `#EDC0AE` | warm highlight from the portrait                               |
| `fg`              | `#F2ECEE` | primary text                                                   |

**Accent contrast rule:** use `crimson-light` for coloured text, `crimson` for
borders/glows/indicators, and `crimson-dark` for filled surfaces carrying
`bone` text. `text-crimson` on `coal-900` sits at ~4.2:1 and fails AA — that is
why the components use `crimson-light`.

Type: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (labels) —
all **self-hosted** via `@fontsource`, Latin subsets only. No Google Fonts CDN:
it costs a third-party connection, blocks first render, and forces `style-src`
and `font-src` open in the CSP.

### Signature interaction: the card deck

The four service cards are the visual through-line. In the hero they sit in a
floating stack (`HeroDeck.tsx`) — each card drifts on its own phase, the deck
parallax-tilts to the cursor, hovering fans them apart. Scrolling "deals" them
into the Services grid: `Services.tsx` drives each card from a collapsed,
rotated stack to its natural grid cell off `useScroll` progress. The collapse
is expressed in percentages of each card's own width, so it works at any
breakpoint without measuring layout. Below `sm` it degrades to a staggered
reveal — there is no horizontal room to fan into.

### Motion primitives (`src/components/motion/`)

`BlobField` (morphing gradient blobs) · `Magnetic` (buttons ease toward the
cursor) · `TiltCard` (3D hover tilt) · `Marquee` (seamless tool strip) ·
`ScrollProgress` (top bar)

### The hero must fit one fold

`#hero` is `min-h-[100svh]` and a flex column. `svh` not `vh` — deliberate, it
accounts for iOS Safari's collapsing toolbar. The deck sits beside the copy
from `md` (768px) up - it used to start at `lg`, which hid it at 100% zoom on a
~1000px window. Below `md` there is no deck (a phone cannot hold copy + CTAs +
stats + deck), and below `lg` the "runs daily on" ticker moves to `MobileDeckBand`. A
`max-height: 700px` query sheds the status badge and steps type down.
Verified at 375×600, 402×700, 402×874, 1366×768, 1440×900, 1920×1080.
**If you add anything to the hero, re-check those sizes.**


### Navbar and mobile sheet are dark-first, always

The bar never inverts to a light surface. Scrolling only densifies the glass
and firms up the border. An earlier revision animated
`backgroundColor` to the light-theme cream while the link text had already
moved to the light `bone`/`fg` tokens - white on white, invisible on scroll.
The same fault hit the mobile sheet (`bg-bone/95` panel, light links).

Those colours were **hardcoded rgba inside a Framer `animate` object**, not
Tailwind classes, so a palette-wide rename could not see them. If you ever
re-theme, grep for raw `rgba(` in `src/components/` as well as for tokens.

### Marquee

`Marquee` takes a `speed` prop (seconds per cycle). Mobile uses a shorter
duration because the track is shorter and a long duration reads as drift.

Three things keep it working where it previously did not:
- **It renders on mobile.** `MobileDeckBand` used to print a static wrapped
  list, so the animated component never mounted below `lg` - which looked like
  "the marquee is broken on mobile".
- **Hover-pause is gated behind `@media (hover: hover) and (pointer: fine)`.**
  On touch, `:hover` latches after a tap and freezes the track until the user
  taps elsewhere.
- **`-webkit-mask-image` is set explicitly.** Tailwind's arbitrary
  `[mask-image:...]` utility emits only the unprefixed property, which iOS
  Safari ignores.

Under `prefers-reduced-motion` the track drops its duplicate copy and wraps
into a centred list, rather than being parked mid-translate by the blanket
`animation-duration: 0.01ms` override.

### Film grain

`.grain` on the app root paints a fixed feTurbulence noise layer at ~3%
opacity. On near-black, wide radial gradients band into visible steps on 8-bit
displays; the noise dithers them away. It is inline SVG, so no extra request,
and `img-src 'self' data:` already permits it.

### Gotchas

- The hero and footer cursor effect is one canvas component,
  `motion/LightningCursor.tsx`. It attaches to its parent section, is
  `pointer-events: none`, and only runs on desktop with a real mouse (>= md,
  `hover: hover`, `pointer: fine`); `prefers-reduced-motion` keeps just the
  steady glow. Tune it through the constants at the top of the file.
- The About badge (`LanyardBadge.tsx`, wrapping the vendored React Bits
  `vendor/lanyard/Lanyard.jsx`) pulls in three.js, so it is lazy-loaded and
  only mounts when scrolled near. **Never import `Lanyard` statically** - it
  would put ~130 KB gzip of three.js into the entry chunk. Replace the artwork
  by overwriting `public/lanyard/my_ID.png` (front) and `card-back.webp`
  (keep the filenames); both are painted on a 1.6 : 2.25 card, so 1024 x 1440
  is the ideal size. The strap is plain black on purpose - there is no strap
  image. The canvas edges are feathered by `.lanyard-fade` in `index.css`.
- Nav links keep a real `href="#section"` (no-JS, crawlers, a11y) but a click is
  handled by `lib/scroll.ts`, so the address bar never shows `#about`,
  `#services` etc. The navbar and footer logos scroll to the top. Hashes that
  arrive from outside are scrolled to, then stripped.
- **Tailwind 4, and why.** Tailwind 3 depends on `fast-glob -> micromatch -> braces`,
  and `braces` has no patched release, so `npm audit` could never reach zero on it.
  Tailwind 4 has no such tree. The theme (colours, fonts, shadows) lives in
  `@theme` at the top of `src/index.css`; there is no `tailwind.config.js`, and
  `postcss.config.js` only loads `@tailwindcss/postcss`. Always install with
  `npm ci`, never a bare `npm install` over an old `node_modules` - a leftover
  Tailwind 3 there is what causes "use `@tailwindcss/postcss`" errors.
- Moving to v4 was verified element by element against the v3 build (layout,
  computed styles, screenshots, hover and focus states). Where v4 behaves
  differently, the old behaviour was put back on purpose - do not "tidy" these:
  - **Fonts are imported in `src/fonts.css` (from `main.tsx`), not with CSS
    `@import` inside `index.css`.** Tailwind 4 inlines CSS imports without
    rebasing `url()`s, so the fontsource files 404 in production and every font
    silently falls back to system-ui.
  - `@source` in `index.css` limits scanning to `index.html` and `src/**`, as v3
    did; otherwise v4 also emits classes for words found in this README.
  - `hover`, `group-hover` and `peer-hover` are redefined as plain `:hover`
    (v4 wraps them in `@media (hover: hover)`, which removes tap-to-hover on
    phones); buttons keep `cursor: pointer`.
  - Gradients use `bg-linear-to-*/srgb` (v4 defaults to oklab, which shifts the
    crimson/gold blends).
  - Transitions that list a transform must name `scale` / `translate` /
    `rotate` (`transition-[opacity,scale]`), because v4 no longer uses one
    `transform` property for them.
  - A responsive `sm:text-*` no longer overrides `leading-*` as it did in v3,
    so those spots carry an explicit `sm:leading-*`. `space-y-*` is written as
    `[&>:not([hidden])~:not([hidden])]:mt-*` (margin on the later siblings, as
    in v3) because the Industries stack is `position: sticky`.
  - Footer social icons use `border-[#e5e7eb]`. They were written `border-bone/12`,
    which v3 silently ignored (12 is not on its opacity scale) and so rendered
    the default light border; v4 would have made them faint. Switch back to
    `border-bone/12` if the faint border was the intent.
- `<MotionConfig reducedMotion="user">` in `App.tsx` disables transform
  animation app-wide when the OS preference is set.
- Copy uses plain hyphens, never em/en dashes — a deliberate style choice.
- lucide v1 dropped brand marks, so LinkedIn and GitHub glyphs are inlined in
  `Footer.tsx`.
- Icons live in one shared set (`icons.tsx`); `icon` fields in `data.ts` are
  typed against `IconName`, so a typo fails the build instead of rendering an
  empty box.
- The navbar wordmark is **derived** from `site.url`. Change the domain in one
  place.

---

## Security

`public/_headers` is applied at the edge by Cloudflare Pages.

```
default-src 'self'; script-src 'self' <sha256>; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
frame-ancestors 'none'; base-uri 'none'; form-action 'none';
upgrade-insecure-requests
```

Plus HSTS (2y, preload), `X-Content-Type-Options`, `Referrer-Policy`,
a locked-down `Permissions-Policy`, and COOP/CORP.

### The inline-script hash is automated

`index.html` contains one inline block — the JSON-LD `Person` schema. Rather
than opening `script-src` with `'unsafe-inline'`, `npm run build` runs
`scripts/csp-hash.mjs`, which hashes the inline block **in the built output**
and substitutes it into `dist/_headers`. It reads from `dist/`, not source,
because the hash must cover the exact bytes the browser sees.

CI fails the build if the `__INLINE_SCRIPT_HASHES__` placeholder survives.

### Why `style-src` still allows `'unsafe-inline'`

Framer Motion (and React generally) animates by writing inline `style`
attributes. CSP Level 3 offers `style-src-attr` to allow _only_ attributes
while keeping `<style>` blocks strict, but Safari does not implement it — it
would fall back to `style-src 'self'` and break every animation on iOS.
`'unsafe-inline'` on `style-src` is the pragmatic choice here. It is a real
weakening; on a static site with no user input and no third-party script, the
practical exposure is close to nil, but it is a trade-off and not a win.

Verify after deploy: <https://securityheaders.com/?q=cloudmonk.cc>

---

## Deploying to Cloudflare Pages

### Connect the Git repo (recommended)

1. Push to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: set env var `NODE_VERSION` = `22`
4. **Save and Deploy.** Every push to `main` deploys; every PR gets a preview URL.
5. **Custom domains → Add** `cloudmonk.cc` and `www.cloudmonk.cc`.
   Add a redirect rule so `www` → apex (or the reverse) — pick one canonical
   host, since `index.html` hard-codes the canonical as the apex.

### Direct upload (no Git)

`npm run build`, then drag `dist/` into **Pages → Upload assets**. You lose CI,
preview deploys, and rollback — use the Git path unless you have a reason.

### Post-deploy checklist

- [ ] `curl -sI https://cloudmonk.cc | grep -i content-security-policy` returns the CSP
- [ ] Browser console is clean — a CSP violation shows up as a blocked resource
- [ ] `https://cloudmonk.cc/sitemap.xml` and `/robots.txt` resolve
- [ ] OG card renders — check with the LinkedIn Post Inspector
- [ ] Lighthouse ≥ 95 across the board
- [ ] CV downloads at `/media/Saif_Zaman_CV.pdf`
- [ ] Submit the sitemap in Google Search Console

---

## Project structure

```
.github/workflows/ci.yml   typecheck · lint · format · build · CSP assertion
scripts/csp-hash.mjs       hashes inline JSON-LD into dist/_headers
scripts/gen-sitemap.mjs    sitemap with a live lastmod date
src/
  components/              page sections
  components/motion/       shared animation primitives
  hooks/useInView.ts       scroll-reveal
  hooks/useCountUp.ts      RAF count-up for hero stats
  lib/utils.ts             cn() class merger
  data.ts                  ALL editable content
  App.tsx                  page assembly + MotionConfig
  index.css                global styles, font imports
public/
  _headers  robots.txt  favicons  portrait.*  preview.webp
  media/Saif_Zaman_CV.pdf
```
