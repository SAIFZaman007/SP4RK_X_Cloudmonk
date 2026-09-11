import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { services } from '../data';
import Icon from './icons';

/**
 * The hero's signature element: the same four service cards that later appear
 * in the Services grid, here stacked like a dealt hand. Each floats on its own
 * phase, the deck parallax-tilts to the cursor, and hovering fans them apart.
 * Scrolling "deals" them into the grid (Services.tsx) as one continuous move.
 *
 * Offsets are mostly vertical so every card's header stays readable instead of
 * being buried under the card in front.
 */

const CARD_W = 272;
const HALF_W = CARD_W / 2;
const HALF_H = 68;

const layout = [
  { x: -18, y: -118, rot: -5, scale: 0.92 },
  { x: 12, y: -39, rot: 3, scale: 0.95 },
  { x: -10, y: 39, rot: -2.5, scale: 0.975 },
  { x: 8, y: 118, rot: 4, scale: 1 },
];

const fan = [
  { x: -78, y: -150, rot: -11, scale: 0.96 },
  { x: 66, y: -50, rot: 7, scale: 0.99 },
  { x: -66, y: 50, rot: -6, scale: 1 },
  { x: 78, y: 150, rot: 10, scale: 1.02 },
];

// A concrete signal per card, so the deck carries information and not just style.
const meta = [
  { tag: 'FastAPI · React', accent: 'from-crimson to-crimson-dark' },
  { tag: 'RAG · Vector DB', accent: 'from-steel to-steel-dark' },
  { tag: 'REST · OpenAPI', accent: 'from-crimson-light to-crimson' },
  { tag: 'Docker · CI', accent: 'from-steel-light to-steel' },
];

export function DeckCard({ i, compact = false }: { i: number; compact?: boolean }) {
  // `services`, `meta`, `layout` and `fan` are parallel tables of the same
  // length. Returning null on a miss keeps the invariant explicit and the
  // component total, rather than asserting non-null at six call sites.
  const svc = services[i];
  const m = meta[i];
  if (!svc || !m) return null;
  return (
    <div className="group relative">
      {/* glow halo */}
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${m.accent} opacity-25 blur-[10px] transition-opacity duration-500 group-hover:opacity-45`}
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-2xl border border-bone/15 bg-coal-800/95 shadow-panel ring-1 ring-inset ring-white/[0.06]">
        {/* top sheen */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bone/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.accent} opacity-[0.07]`}
          aria-hidden="true"
        />

        <div className={compact ? 'relative p-3.5' : 'relative p-4'}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 flex-shrink-0 place-items-center text-gold">
              <Icon name={svc.icon} className="h-7 w-7" />
            </span>
            <h3 className="flex-1 font-display text-[13.5px] font-semibold leading-tight text-bone">
              {svc.title}
            </h3>
            <span className="font-mono text-[10px] text-bone/30">0{i + 1}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-bone/25 to-transparent" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-bone/40">
              {m.tag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroDeck() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-11, 11]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), { stiffness: 150, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        px.set(0.5);
        py.set(0.5);
      }}
      className="relative mx-auto h-[340px] w-full max-w-[340px] xl:h-[400px] xl:max-w-[360px]"
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {services.map((svc, i) => {
          const target = (hovering && !reduce ? fan[i] : layout[i]) ?? layout[0];
          const base = layout[i] ?? layout[0];
          if (!target || !base) return null;
          return (
            <motion.div
              key={svc.title}
              className="absolute left-1/2 top-1/2"
              style={{ zIndex: i + 1, width: CARD_W, marginLeft: -HALF_W, marginTop: -HALF_H }}
              initial={{ opacity: 0, y: base.y + 46, scale: 0.82 }}
              animate={{
                opacity: 1,
                x: target.x,
                y: reduce ? target.y : [target.y - 5, target.y + 5, target.y - 5],
                rotate: target.rot,
                scale: target.scale,
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.35 + i * 0.09 },
                x: { type: 'spring', stiffness: 210, damping: 23 },
                rotate: { type: 'spring', stiffness: 210, damping: 23 },
                scale: { type: 'spring', stiffness: 210, damping: 23 },
                y: reduce
                  ? { type: 'spring', stiffness: 210, damping: 23 }
                  : {
                      duration: 4.4 + i * 0.7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.35,
                    },
              }}
            >
              <DeckCard i={i} />
            </motion.div>
          );
        })}
      </motion.div>

      <span className="pointer-events-none absolute inset-x-0 -bottom-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone/30">
        {hovering ? 'Scroll to deal them out' : 'Hover the deck'}
      </span>
    </div>
  );
}
