import { useReducedMotion } from 'framer-motion';

/**
 * Drifting cloud / smoke haze for the hero and the contact panel.
 *
 * WHY NOT THREE.JS + GSAP
 * -----------------------
 * The obvious way to do volumetric smoke is a WebGL shader, and that is the
 * right call when smoke is the subject. Here it is a background wash behind
 * text, several hundred pixels of blur, at low opacity. Reaching for three.js
 * would add roughly 150 KB gzipped plus GSAP on top - more JavaScript than the
 * entire rest of this site ships - to move pixels no one will look at directly.
 * It also means a WebGL context and a render loop competing for frames with the
 * magnetic cards, on a page whose first impression is how fast it loads.
 *
 * So this is built from three layers of fractal noise instead:
 *
 *   - The noise itself is an inline SVG `feTurbulence`, the same primitive the
 *     `.grain` overlay already uses, so no new browser surface and no network
 *     request. It is a data URI, which the existing CSP (`img-src 'self' data:`)
 *     already permits - a shader would have needed no CSP change either, but a
 *     third-party CDN script would have.
 *   - Each layer drifts at its own speed, scale and direction. Parallax between
 *     layers is what reads as depth; a single moving layer reads as a sliding
 *     texture.
 *   - Animation is pure CSS `transform`, so it runs on the compositor. No rAF
 *     callback, no main-thread work, and it costs nothing when scrolled off.
 *
 * The result is a few hundred bytes of CSS and markup for something that, at
 * this opacity and blur, is visually indistinguishable from the shader version.
 *
 * Sits *behind* BlobField, which supplies the coloured light; this supplies the
 * structure that light passes through. Neither is legible alone - together they
 * read as lit haze.
 */

type Layer = {
  /** Turbulence base frequency. Lower = larger, softer billows. */
  freq: number;
  opacity: number;
  /** Seconds for one full drift cycle. Different per layer, else they beat. */
  duration: number;
  /** Extra scale so the layer can translate without exposing an edge. */
  scale: number;
  tint: string;
  blur: number;
};

/* Durations are prime-ish and mutually non-divisible on purpose: shared or
   harmonically related periods make the three layers re-align on a fixed
   schedule, and a background that visibly repeats stops reading as weather.
   Halved from the previous 64/91/122s - at that length the drift was below the
   threshold where the eye registers movement at all. Opacity, tint, blur and
   scale are unchanged, so the colour grade and density are identical. */
const LAYERS: Layer[] = [
  { freq: 0.012, opacity: 0.3, duration: 37, scale: 1.55, tint: '#DF3640', blur: 26 },
  { freq: 0.02, opacity: 0.22, duration: 53, scale: 1.4, tint: '#EDC0AE', blur: 34 },
  { freq: 0.008, opacity: 0.16, duration: 71, scale: 1.7, tint: '#D4AF37', blur: 44 },
];

/**
 * Builds the noise tile as a data URI.
 *
 * `numOctaves` 4 is the point of diminishing returns for cloud shapes - 3 looks
 * synthetic, 5 costs filter time for detail that the blur immediately destroys.
 * The seed differs per layer so the three do not overlay as one identical
 * pattern at three scales, which is instantly readable as a repeat.
 */
function noiseUrl(freq: number, seed: number) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='700'>` +
    `<filter id='c'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' seed='${seed}' stitchTiles='stitch'/>` +
    // Flattens the noise into soft plumes instead of even static - without this
    // it reads as television snow rather than smoke.
    `<feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 -0.35'/>` +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(#c)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function CloudField({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {LAYERS.map((l, i) => (
        <div
          key={i}
          className={reduce ? 'cloud-layer' : `cloud-layer cloud-drift-${i + 1}`}
          style={{
            opacity: l.opacity,
            backgroundColor: l.tint,
            // The noise is the stencil; the tint is what shows through it, so
            // the layer takes the palette rather than painting grey smoke.
            WebkitMaskImage: noiseUrl(l.freq, i * 7 + 3),
            maskImage: noiseUrl(l.freq, i * 7 + 3),
            filter: `blur(${l.blur}px)`,
            ['--cloud-scale' as string]: String(l.scale),
            ['--cloud-duration' as string]: `${l.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
