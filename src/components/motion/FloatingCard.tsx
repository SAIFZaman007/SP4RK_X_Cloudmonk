import { useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { usePointer } from '../../hooks/usePointer';

/**
 * A card that idles with a slow float and leans toward the cursor as it
 * approaches - magnetic, not merely hover-reactive.
 *
 * Four effects are layered, and they are deliberately split across two DOM
 * nodes rather than fought over on one:
 *
 *   outer  - the idle float. A slow, looping vertical drift on its own phase
 *            per card, so a row breathes instead of pulsing in lockstep.
 *   inner  - everything driven by the pointer: magnetic translate, 3D tilt,
 *            lift, and the spotlight that tracks the cursor across the face.
 *
 * They are separate because both want `y`. Composing them on one element means
 * one transform overwriting the other every frame; nesting lets the browser
 * compose them for free.
 *
 * Attraction falls off with distance and is squared, so a card is inert until
 * the cursor is genuinely near it and then commits over the last ~40% of the
 * radius. A linear falloff makes the whole grid twitch constantly, which reads
 * as noise rather than response.
 */
export default function FloatingCard({
  children,
  index = 0,
  className = '',
  /** Pixels from the card's centre at which attraction begins. */
  radius = 340,
  /** Fraction of the pointer offset the card travels at full pull. */
  strength = 0.12,
  /** Peak tilt in degrees at full pull. */
  tilt = 8,
  /**
   * Corner radius of the spotlight overlay. It has to match the wrapped
   * element's own radius or the glow is clipped to a different silhouette and
   * shows as bright wedges in the corners - visible on anything larger than a
   * grid card, where the mismatch is small enough to miss.
   */
  spotlightClassName = 'rounded-2xl',
  /** Peak idle drift in px. Large panels want less travel than small cards. */
  floatAmplitude = 9,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  radius?: number;
  strength?: number;
  tilt?: number;
  spotlightClassName?: string;
  floatAmplitude?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { x: pointerX, y: pointerY, enabled } = usePointer();
  const [hovered, setHovered] = useState(false);

  const active = enabled && !reduce;

  // Targets written every frame, then smoothed by springs. Writing the spring
  // target rather than the rendered value is what gives the card weight: it
  // trails the cursor and overshoots slightly on release.
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const lift = useMotionValue(0);

  const spring = { stiffness: 170, damping: 20, mass: 0.6 };
  const sx = useSpring(tx, spring);
  const sy = useSpring(ty, spring);
  const sRotX = useSpring(rx, { stiffness: 150, damping: 18 });
  const sRotY = useSpring(ry, { stiffness: 150, damping: 18 });
  const sLift = useSpring(lift, { stiffness: 200, damping: 24 });

  // Spotlight position, in element-local percentages.
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacity = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 });

  useAnimationFrame(() => {
    const el = ref.current;
    if (!el || !active) return;

    const px = pointerX.get();
    const py = pointerY.get();

    // getBoundingClientRect is read once per frame per card. It is a layout
    // read, but it is the only way to stay correct through scroll, resize and
    // the reveal animation that moves these cards on entry - caching it and
    // invalidating on scroll costs more code and still drifts mid-animation.
    const r = el.getBoundingClientRect();

    // Offscreen cards do no work at all.
    if (r.bottom < 0 || r.top > window.innerHeight) return;

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = px - cx;
    const dy = py - cy;

    const dist = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - dist / radius);
    const eased = pull * pull;

    tx.set(dx * eased * strength);
    ty.set(dy * eased * strength);

    // Inverted on X: the card leans *into* the cursor, as a physical panel
    // pressed at one corner would. Leaning away reads as repulsion.
    ry.set((dx / (r.width / 2)) * tilt * eased);
    rx.set((-dy / (r.height / 2)) * tilt * eased);

    lift.set(eased * 14);

    const inside = px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;
    if (inside) {
      glowX.set(((px - r.left) / r.width) * 100);
      glowY.set(((py - r.top) / r.height) * 100);
    }
    glowOpacity.set(inside ? 1 : eased * 0.35);
  });

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${glowX}% ${glowY}%, rgba(212,175,55,0.16), rgba(223,54,64,0.06) 42%, transparent 70%)`;

  // The idle float, as one object rather than two conditional props. Under
  // `exactOptionalPropertyTypes` an inline `transition={reduce ? undefined :
  // {...}}` is a type error, and building the pair together also keeps the
  // reduced-motion branch honest: it cannot end up with a looping transition
  // attached to a static animate.
  const float = reduce
    ? { animate: { y: 0 }, transition: { duration: 0 } }
    : {
        animate: {
          y: [0, -floatAmplitude, 0, floatAmplitude * 0.78, 0],
        },
        transition: {
          duration: 9 + index * 1.3,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay: index * 0.55,
        },
      };

  return (
    <motion.div {...float} style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          x: sx,
          y: sy,
          rotateX: sRotX,
          rotateY: sRotY,
          z: sLift,
          transformStyle: 'preserve-3d',
        }}
        className={`group relative h-full ${className}`}
      >
        <div className="relative h-full">{children}</div>

        {/* Overlays are rendered AFTER the content, not before it.
            
            They used to come first, which meant that for any card with an
            opaque fill - which is every card that uses this component, since
            they all sit on `bg-surface` or `dark-panel` - the card covered the
            spotlight completely and neither effect was ever visible. Same
            box, later in DOM order, so they now paint on top; both are
            pointer-events-none, so they never intercept the hover they are
            reacting to. */}
        <motion.span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${spotlightClassName}`}
          style={{ backgroundImage: spotlight, opacity: glowOpacity }}
        />

        {/* Rim light. A single hairline that brightens on approach - the
            cheapest way to make a flat panel read as a physical object. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-opacity duration-500 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </motion.div>
    </motion.div>
  );
}
