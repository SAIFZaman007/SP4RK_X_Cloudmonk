import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Lightning cursor for the hero and the footer.
 *
 * WHAT IT REPLACES
 * ----------------
 * Both sections used to follow the pointer with a blurred radial gradient at
 * 18-25% opacity. It was easy to miss, and a 20-30px CSS blur on a 460-520px
 * element is re-rasterised every frame it moves. This draws the same ambient
 * pool of light on a canvas - no filter, one cheap gradient fill - and adds the
 * part that was missing: actual lightning.
 *
 * WHAT YOU SEE
 * ------------
 *   - TRAIL    Moving the pointer lays down jagged bolts along its path. Each
 *              flashes at full brightness, then decays over ~0.3s, so a fast
 *              sweep leaves a streak of arcs behind it.
 *   - CRACKLE  Even held still, short arcs spit out of the cursor a few times a
 *              second - the effect reads as live rather than as a mouse trail.
 *   - STRIKE   Every few seconds a longer, forked bolt fires from the cursor
 *              and the surrounding glow flares with it.
 *   - GLOW     A soft pool of crimson light that trails the pointer slightly,
 *              with a small white-hot spark at the pointer itself.
 *
 * Each bolt is drawn in three additive passes - wide crimson halo, crimson-light
 * body, near-white core - which is what makes a 1px line look like it is giving
 * off light. Colours come from the site palette, so it belongs to the page
 * rather than looking like a stock "electric" effect.
 *
 * COST
 * ----
 * One requestAnimationFrame loop, running only while the pointer is over the
 * section (plus the ~0.2s fade-out and any bolts still decaying), and paused
 * when the section scrolls off screen. Bolt geometry is built once as a Path2D
 * at spawn and re-stroked each frame, so the loop allocates nothing but a few
 * short strings. The backing store is capped at 1.5x device pixels: the halo is
 * a soft glow, so the extra resolution would cost fill-rate and show nothing.
 *
 * WHERE IT RUNS
 * -------------
 * Desktop with a real mouse only (>= md, hover + fine pointer) - the same
 * audience the old spotlight had. On touch there is no hover, so nothing is
 * attached and the canvas is never sized. With `prefers-reduced-motion` the
 * flashing bolts are dropped entirely and only the steady, non-flickering glow
 * remains.
 *
 * USAGE
 * -----
 * Render as a child of a `position: relative` section. It sizes itself to its
 * parent, listens on the parent, and is `pointer-events: none`, so it never
 * intercepts a click on the content beneath it.
 */

type Pt = readonly [number, number];

/** RGB triplets from the site palette (tailwind.config.js). */
const RGB = {
  /** White-hot bolt core, warmed a touch toward `steel`. */
  core: '255, 246, 240',
  /** `crimson-light` - the body of the bolt. */
  hot: '244, 115, 123',
  /** `crimson` - halo and ambient glow. */
  base: '223, 54, 64',
} as const;

/** Mirrors the old spotlight's `md:block`, and excludes touch-only devices. */
const ACTIVE_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)';

const TAU = Math.PI * 2;
const MAX_DPR = 1.5;
const MAX_BOLTS = 40;
/** Pointer travel (px) between trail segments. Lower = denser, busier trail. */
const TRAIL_STEP = 24;
/** Longest single trail segment. A fast flick is trimmed to its newest stretch. */
const TRAIL_REACH = 220;

interface Bolt {
  main: Path2D;
  forks: Path2D;
  born: number;
  life: number;
  weight: number;
}

interface BoltOptions {
  life: number;
  weight: number;
  forks: number;
  spread: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Midpoint displacement: split the segment, push the midpoint sideways by a
 * random amount, recurse with a smaller amount. Endpoints stay pinned. This is
 * the classic cheap lightning shape - large lazy bends with finer kinks inside
 * them - and it is why the bolt looks like it was struck, not scribbled.
 */
function jagged(a: Pt, b: Pt, levels: number, spread: number): Pt[] {
  let points: Pt[] = [a, b];
  let offset = Math.hypot(b[0] - a[0], b[1] - a[1]) * spread;

  for (let level = 0; level < levels; level++) {
    const next: Pt[] = [];
    for (const [i, p] of points.entries()) {
      next.push(p);
      const q = points[i + 1];
      if (!q) continue;
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const length = Math.hypot(dx, dy) || 1;
      const push = (Math.random() * 2 - 1) * offset;
      next.push([
        (p[0] + q[0]) / 2 - (dy / length) * push,
        (p[1] + q[1]) / 2 + (dx / length) * push,
      ]);
    }
    points = next;
    offset *= 0.55;
  }
  return points;
}

function trace(path: Path2D, points: readonly Pt[]) {
  for (const [i, [x, y]] of points.entries()) {
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
}

function createBolt(a: Pt, b: Pt, now: number, opts: BoltOptions): Bolt {
  const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const levels = dist < 50 ? 3 : dist < 120 ? 4 : dist < 240 ? 5 : 6;
  const trunk = jagged(a, b, levels, opts.spread);

  const main = new Path2D();
  trace(main, trunk);

  // Forks leave the trunk at a shallow angle and are shorter, thinner and
  // fainter. They are what separate "lightning" from "a wobbly line".
  const forks = new Path2D();
  const heading = Math.atan2(b[1] - a[1], b[0] - a[0]);
  for (let i = 0; i < opts.forks; i++) {
    const from = trunk[Math.floor(trunk.length * rand(0.2, 0.8))];
    if (!from) continue;
    const bend = (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.9);
    const length = clamp(dist * rand(0.22, 0.5), 22, 110);
    const to: Pt = [
      from[0] + Math.cos(heading + bend) * length,
      from[1] + Math.sin(heading + bend) * length,
    ];
    trace(forks, jagged(from, to, 3, 0.3));
  }

  return { main, forks, born: now, life: opts.life, weight: opts.weight };
}

/** Halo -> body -> core. Additive, so overlapping bolts brighten rather than occlude. */
function strokeBolt(ctx: CanvasRenderingContext2D, path: Path2D, weight: number, alpha: number) {
  ctx.lineWidth = 9 * weight;
  ctx.strokeStyle = `rgba(${RGB.base}, ${0.2 * alpha})`;
  ctx.stroke(path);
  ctx.lineWidth = 3 * weight;
  ctx.strokeStyle = `rgba(${RGB.hot}, ${0.62 * alpha})`;
  ctx.stroke(path);
  ctx.lineWidth = 1.2 * weight;
  ctx.strokeStyle = `rgba(${RGB.core}, ${alpha})`;
  ctx.stroke(path);
}

function fillGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rgb: string,
  alpha: number
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
  g.addColorStop(0.4, `rgba(${rgb}, ${alpha * 0.35})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

/**
 * The effect proper. Returns its own teardown, so the component can attach and
 * detach it as the "is this a desktop mouse?" media query changes.
 */
function run(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  ctx: CanvasRenderingContext2D,
  reduce: boolean
): () => void {
  let width = 0;
  let height = 0;
  let raf = 0;
  let last = 0;
  let inside = false;
  let visible = true;
  let snap = false;
  let presence = 0;
  let flash = 0;
  let nextCrackle = 0;
  let nextStrike = 0;

  // Client coordinates are the source of truth; they are converted to
  // host-local space at the moment they are used, against a fresh rect. That
  // keeps the glow glued to the pointer while the page scrolls under a
  // stationary mouse, where no pointermove fires to correct it.
  const client = { x: 0, y: 0 };
  const lastTrail = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const head = { x: 0, y: 0 };
  const bolts: Bolt[] = [];

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = host.clientWidth;
    height = host.clientHeight;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const add = (bolt: Bolt) => {
    bolts.push(bolt);
    if (bolts.length > MAX_BOLTS) bolts.shift();
  };

  const wake = () => {
    if (raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(64, now - last);
    last = now;

    const rect = host.getBoundingClientRect();
    pointer.x = client.x - rect.left;
    pointer.y = client.y - rect.top;
    if (snap || reduce) {
      head.x = pointer.x;
      head.y = pointer.y;
      snap = false;
    } else {
      // The glow trails the pointer by a beat; the spark at the pointer does not.
      const follow = 1 - Math.exp(-dt / 60);
      head.x += (pointer.x - head.x) * follow;
      head.y += (pointer.y - head.y) * follow;
    }

    presence += ((inside ? 1 : 0) - presence) * (1 - Math.exp(-dt / (inside ? 90 : 200)));
    flash *= Math.exp(-dt / 160);

    if (inside && !reduce) {
      if (now >= nextCrackle) {
        const angle = rand(0, TAU);
        const length = rand(26, 84);
        add(
          createBolt(
            [pointer.x, pointer.y],
            [pointer.x + Math.cos(angle) * length, pointer.y + Math.sin(angle) * length],
            now,
            { life: rand(150, 260), weight: 0.8, forks: Math.random() < 0.4 ? 1 : 0, spread: 0.3 }
          )
        );
        nextCrackle = now + rand(60, 190);
      }
      if (now >= nextStrike) {
        const angle = rand(0, TAU);
        const length = rand(140, 270);
        add(
          createBolt(
            [pointer.x, pointer.y],
            [pointer.x + Math.cos(angle) * length, pointer.y + Math.sin(angle) * length],
            now,
            { life: 420, weight: 1.35, forks: Math.random() < 0.5 ? 3 : 2, spread: 0.26 }
          )
        );
        flash = 1;
        nextStrike = now + rand(1700, 3900);
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (presence > 0.01) {
      fillGlow(ctx, head.x, head.y, 210 + flash * 50, RGB.base, presence * (0.27 + flash * 0.3));
      fillGlow(ctx, pointer.x, pointer.y, 26, RGB.core, presence * 0.4 * (1 + flash * 0.6));
    }

    for (let i = bolts.length - 1; i >= 0; i--) {
      const bolt = bolts[i];
      if (!bolt) continue;
      const t = (now - bolt.born) / bolt.life;
      if (t >= 1) {
        bolts.splice(i, 1);
        continue;
      }
      // Full brightness for the opening flash, then a convex decay. The random
      // factor is the flicker - it is re-rolled every frame, which is what makes
      // the bolt shimmer instead of fading like a CSS opacity transition.
      const fade = t < 0.12 ? 1 : Math.pow(1 - (t - 0.12) / 0.88, 1.8);
      const alpha = fade * rand(0.7, 1);
      strokeBolt(ctx, bolt.main, bolt.weight, alpha);
      strokeBolt(ctx, bolt.forks, bolt.weight * 0.6, alpha * 0.75);
    }

    ctx.globalCompositeOperation = 'source-over';

    if (visible && (inside || presence > 0.01 || flash > 0.01 || bolts.length > 0)) {
      raf = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };

  const spawnTrail = () => {
    const dx = client.x - lastTrail.x;
    const dy = client.y - lastTrail.y;
    const dist = Math.hypot(dx, dy);
    if (dist < TRAIL_STEP) return;

    const rect = host.getBoundingClientRect();
    const reach = Math.min(dist, TRAIL_REACH);
    const ax = client.x - (dx / dist) * reach;
    const ay = client.y - (dy / dist) * reach;
    add(
      createBolt(
        [ax - rect.left, ay - rect.top],
        [client.x - rect.left, client.y - rect.top],
        performance.now(),
        { life: rand(260, 360), weight: 1, forks: Math.random() < 0.4 ? 1 : 0, spread: 0.22 }
      )
    );
    lastTrail.x = client.x;
    lastTrail.y = client.y;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !visible) return;
    client.x = e.clientX;
    client.y = e.clientY;
    if (!inside) {
      inside = true;
      snap = true;
      lastTrail.x = client.x;
      lastTrail.y = client.y;
      nextCrackle = performance.now() + 120;
      nextStrike = performance.now() + 700;
    } else if (!reduce) {
      spawnTrail();
    }
    wake();
  };

  const onLeave = () => {
    inside = false;
    wake();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Off-screen sections must not keep a rAF loop alive. Dropping the live
  // state (rather than just pausing) means nothing stale is on the canvas the
  // next time the section comes back into view.
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (!visible) {
      inside = false;
      presence = 0;
      flash = 0;
      bolts.length = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, width, height);
    }
  });
  intersectionObserver.observe(host);

  resize();
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    ctx.clearRect(0, 0, width, height);
  };
}

export default function LightningCursor({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const media = window.matchMedia(ACTIVE_QUERY);
    let teardown: (() => void) | null = null;

    const sync = () => {
      if (media.matches && !teardown) {
        teardown = run(canvas, host, ctx, reduce);
      } else if (!media.matches && teardown) {
        teardown();
        teardown = null;
      }
    };

    sync();
    media.addEventListener('change', sync);
    return () => {
      media.removeEventListener('change', sync);
      teardown?.();
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden h-full w-full md:block',
        className
      )}
    />
  );
}
