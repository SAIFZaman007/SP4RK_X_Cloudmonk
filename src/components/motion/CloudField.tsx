import { useReducedMotion } from 'framer-motion';

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

const LAYERS: Layer[] = [
  { freq: 0.012, opacity: 0.3, duration: 37, scale: 1.55, tint: '#DF3640', blur: 26 },
  { freq: 0.02, opacity: 0.22, duration: 53, scale: 1.4, tint: '#EDC0AE', blur: 34 },
  { freq: 0.008, opacity: 0.16, duration: 71, scale: 1.7, tint: '#D4AF37', blur: 44 },
];

function noiseUrl(freq: number, seed: number) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='700'>` +
    `<filter id='c'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' seed='${seed}' stitchTiles='stitch'/>` +
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