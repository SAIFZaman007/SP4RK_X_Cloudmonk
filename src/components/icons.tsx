import type { CSSProperties } from 'react';

/* Services / hero deck */
import aiProductEngineering from '../assets/icons/ai-product-engineering.png';
import llmRagSystems from '../assets/icons/llm-rag-systems.png';
import backendApiDesign from '../assets/icons/backend-api-design.png';
import deploymentSecurity from '../assets/icons/deployment-security.png';

/* Selected work */
import workTrubbi from '../assets/icons/work-trubbi.png';
import workAddvancedAi from '../assets/icons/work-addvanced-ai.png';
import workElyxaAi from '../assets/icons/work-elyxa-ai.png';
import workPeakPhysique from '../assets/icons/work-peak-physique.png';
import workPowerPlayMortgage from '../assets/icons/work-power-play-mortgage.png';
import work8888Augusta from '../assets/icons/work-8888-augusta.png';

/* Toolkit */
import toolkitAiMl from '../assets/icons/toolkit-ai-ml.png';
import toolkitBackend from '../assets/icons/toolkit-backend.png';
import toolkitFrontend from '../assets/icons/toolkit-frontend.png';
import toolkitDevops from '../assets/icons/toolkit-devops.png';

/**
 * Icon registry.
 *
 * WHY PNG AND NOT SVG
 * -------------------
 * Flaticon gates SVG export behind a paid plan, so the artwork here is PNG.
 * That creates one real problem: a raster cannot inherit `currentColor`, and
 * this design leans on exactly that - every icon is gold at rest and
 * gold-light on hover, driven by the parent's text colour. Shipping <img> tags
 * would freeze fourteen icons at whatever colour their author chose and quietly
 * kill the hover state across three sections.
 *
 * The fix is to treat the PNG as a *stencil* rather than a picture. A CSS mask
 * uses only the alpha channel, so the element paints `background-color:
 * currentColor` through the icon's silhouette. Colour then comes from the
 * cascade exactly as it did with inline SVG - `text-gold`,
 * `group-hover:text-gold-light` and the reduced-motion variants all keep
 * working, and not one consuming component needed changing.
 *
 * Masking is supported by every browser this site targets; the `-webkit-`
 * prefixes Safari still needs live in the `.icon-mask` utility in index.css.
 *
 * THE TRADE-OFF, STATED PLAINLY
 * -----------------------------
 * A mask discards colour. For a line icon that is exactly what we want. For a
 * *flat, full-colour* icon it is fatal: the alpha channel of a filled
 * illustration is one solid block, so it masks down to an unreadable lump.
 *
 * Two of the chosen icons are that kind of artwork - `work-trubbi` (a colour
 * illustration of people) and `work-8888-augusta` (a filled arch). Both are
 * marked `render: 'image'` so they draw as ordinary pictures instead of
 * silhouettes. That keeps them legible, but they will not take the gold accent
 * and will read as visually foreign beside twelve monochrome glyphs.
 *
 * The durable fix is to re-download those two in a *lineal* / outline style
 * and delete their `render` flag. This escape hatch exists so the site is never
 * blocked on that - not because mixing the two styles is desirable.
 *
 * TO SWAP AN ICON: overwrite the .png in src/assets/icons/ keeping the
 * filename, then run `npm run icons:verify`.
 */
type IconEntry = {
  src: string;
  /**
   * 'mask'  - alpha-only stencil, takes currentColor. Correct for line icons.
   * 'image' - drawn as-is with its own colours. Only for flat colour artwork
   *           that would otherwise mask into a blob.
   */
  render?: 'mask' | 'image';
  /**
   * Optical-size escape hatch. Icons drawn by different authors fill their
   * canvas to different extents; at a shared 32px box one may read noticeably
   * heavier than its neighbours. Leave at 1 unless an icon visibly mismatches.
   */
  scale?: number;
  /** Flaticon resource id - provenance for the credit line in data.ts. */
  source?: string;
};

const registry = {
  /* ---- Services / hero deck ---- */
  'ai-engineering': { src: aiProductEngineering, source: '1693746' },
  'llm-rag': { src: llmRagSystems, source: '2152343' },
  'backend-api': { src: backendApiDesign, source: '8750798' },
  'deploy-security': { src: deploymentSecurity, source: '743885' },

  /* ---- Selected work ---- */
  // Colour illustration - see the trade-off note above.
  'group-trip': { src: workTrubbi, render: 'image', source: '4807598' },
  'deal-radar': { src: workAddvancedAi, source: '17772840' },
  'ai-model': { src: workElyxaAi, source: '16209773' },
  fitness: { src: workPeakPhysique, source: '15837400' },
  'mortgage-home': { src: workPowerPlayMortgage, source: '9651303' },
  // Filled artwork - see the trade-off note above.
  landmark: { src: work8888Augusta, render: 'image', source: '3862921' },

  /* ---- Toolkit ---- */
  'ai-ml': { src: toolkitAiMl, source: '13708311' },
  'backend-eng': { src: toolkitBackend, source: '17234310' },
  'frontend-eng': { src: toolkitFrontend, source: '11869427' },
  'devops-sec': { src: toolkitDevops, source: '12219584' },
} as const satisfies Record<string, IconEntry>;

/**
 * Derived from the registry rather than declared beside it, so the type and the
 * shipped set cannot disagree and removing an entry errors at every call site
 * that still wants it.
 */
export type IconName = keyof typeof registry;

export default function Icon({
  name,
  className = 'h-5 w-5',
  title,
}: {
  name: IconName;
  className?: string;
  /**
   * Only pass this when the icon is the *sole* carrier of meaning. Everywhere
   * on this site the icon sits beside a visible heading that already says the
   * same thing, so the default - hidden from assistive tech - is correct.
   */
  title?: string;
}) {
  const entry: IconEntry = registry[name];
  const { src, render = 'mask', scale = 1 } = entry;

  // Under `exactOptionalPropertyTypes` an explicit `undefined` is not the same
  // as omitting a prop, so the a11y pair is assembled rather than nulled.
  const a11y = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true as const };

  const style: CSSProperties = scale === 1 ? {} : { transform: `scale(${scale})` };

  if (render === 'image') {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${className} object-contain`}
        style={style}
        {...a11y}
      />
    );
  }

  // The URL rides in on a custom property so the mask longhands (and their
  // -webkit- twins) live once in CSS rather than as six inline declarations.
  return (
    <span
      className={`icon-mask ${className}`}
      style={{ ...style, ['--icon' as string]: `url(${src})` }}
      {...a11y}
    />
  );
}
