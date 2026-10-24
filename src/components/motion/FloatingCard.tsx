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

        <motion.span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${spotlightClassName}`}
          style={{ backgroundImage: spotlight, opacity: glowOpacity }}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-6 -top-px h-px bg-linear-to-r/srgb from-transparent via-gold/60 to-transparent transition-opacity duration-500 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </motion.div>
    </motion.div>
  );
}