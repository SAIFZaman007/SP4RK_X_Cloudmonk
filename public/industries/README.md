# Industry slider artwork

The five cards in the Industries slider (rendered by `src/components/Industries.tsx`,
content in `src/data.ts` under `export const industries`) each look for one file here:

    finance-saas.webp
    ai-automation.webp
    fashion-ecommerce.webp
    logistics.webp
    creative-agency.webp

## This folder is intentionally empty

Each card layers its image over a gradient defined by `tint` in `data.ts`, and the
`<img>` hides itself on error. So a missing file degrades to a designed gradient
panel rather than a broken-image glyph — the section ships and looks deliberate
while artwork is being sourced.

Drop the files in and they take over automatically. No code change.

## Licensing note

The reference screenshots this slider was built from came from a commercial Framer
template (covix.framer.website). Those specific images are not licensed for reuse
here, which is why they were not copied in. Use artwork you own, have licensed, or
have generated.

## Specs

- **Aspect ratio 16:9** — the card is `aspect-[16/9]` and the image is
  `object-cover`, so anything else gets cropped from the centre.
- **1600×900** is the useful ceiling. The card renders at most ~560 CSS px wide,
  so 1600 covers a 3x display with room to spare; larger is paid-for detail no
  layout asks for.
- **WebP**, quality ~80. These are five above-the-fold-ish photographic images —
  at 1600×900 that is roughly 80–140 KB each in WebP versus 400 KB+ as JPEG.
- **Keep the bottom third visually quiet.** The title and description sit there
  over a `from-black/85` gradient. A busy or bright lower third fights the copy
  even through the scrim.
