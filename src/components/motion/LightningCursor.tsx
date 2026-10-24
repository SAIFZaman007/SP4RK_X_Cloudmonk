import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

type Pt = readonly [number, number];

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