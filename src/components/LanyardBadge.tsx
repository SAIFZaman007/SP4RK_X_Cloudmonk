import { useEffect, useRef, useState, type ComponentType } from 'react';
import { about, site } from '../data';
import { cn } from '../lib/utils';
import type { LanyardProps } from './vendor/lanyard/Lanyard';

const BADGE_PROPS = {
  cardColor: '#000000',
  finish: 'metallic',
  cornerRadius: 0.35,
  size: 0.62,
  strapColor: '#000000',
  metal: 'gold',
  breeze: 0.45,
} as const satisfies LanyardProps;

const PRELOAD_MARGIN = '600px 0px';

const MOUNT_THRESHOLD = 0.35;

type LanyardComponent = ComponentType<LanyardProps>;

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export default function LanyardBadge() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [Lanyard, setLanyard] = useState<LanyardComponent | null>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsWebGL()) return;

    let cancelled = false;
    const { front, back } = about.badge;

    const preloader = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        preloader.disconnect();
        void Promise.all([
          import('./vendor/lanyard/Lanyard'),
          preloadImage(front),
          preloadImage(back),
        ])
          .then(([module]) => {
            if (!cancelled) setLanyard(() => module.default);
          })
          .catch(() => {
            // Chunk failed to load (offline, stale deploy): keep the poster.
          });
      },
      { rootMargin: PRELOAD_MARGIN }
    );

    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal.disconnect();
        setOnScreen(true);
      },
      { threshold: MOUNT_THRESHOLD }
    );

    preloader.observe(host);
    reveal.observe(host);

    return () => {
      cancelled = true;
      preloader.disconnect();
      reveal.disconnect();
    };
  }, []);

  const live = Lanyard !== null && onScreen;

  return (
    <>
      {/* `lanyard-fade` (index.css) softens all four edges of the canvas, so a
          hard swing dissolves into the page instead of being sliced off at an
          invisible line. */}
      <div
        ref={hostRef}
        className="lanyard-fade relative -mx-6 h-[460px] sm:h-[480px] md:-mx-8"
      >
        <div
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-700',
            live ? 'opacity-0' : 'opacity-100'
          )}
        >
          <img
            src={about.badge.front}
            alt={`${site.legalName} (${site.name}, ${site.brand}) - ${site.role}`}
            className="absolute left-1/2 top-[27%] aspect-[1.6/2.25] h-[60%] -translate-x-1/2 rounded-2xl bg-black object-cover shadow-card ring-1 ring-bone/10"
            loading="lazy"
            width={1024}
            height={1440}
          />
        </div>

        {live && (
          <div className="absolute inset-0">
            <Lanyard
              frontImage={about.badge.front}
              backImage={about.badge.back}
              {...BADGE_PROPS}
            />
          </div>
        )}
      </div>

      <p className="mt-3 text-center font-mono text-[11px] text-fg-45">Grow Infinitely...</p>
    </>
  );
}