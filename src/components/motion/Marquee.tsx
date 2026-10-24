import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** Pixels travelled per second. The one knob that sets perceived speed. */
const DEFAULT_SPEED = 42;

/** Never drop below two copies - one copy cannot wrap onto itself. */
const MIN_COPIES = 2;

/** Guard against a pathological layout (zero-width content) spawning copies. */
const MAX_COPIES = 12;

export default function Marquee({
  children,
  speed = DEFAULT_SPEED,
  className = '',
}: {
  children: ReactNode;
  /** Travel speed in pixels per second. Constant across breakpoints. */
  speed?: number;
  className?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const [copies, setCopies] = useState(MIN_COPIES);
  const [duration, setDuration] = useState<number | null>(null);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const copy = copyRef.current;
    if (!viewport || !copy) return;

    const copyWidth = copy.getBoundingClientRect().width;
    const viewportWidth = viewport.getBoundingClientRect().width;
    if (copyWidth <= 0) return;

    const needed = Math.ceil(viewportWidth / copyWidth) + 1;
    setCopies(Math.min(MAX_COPIES, Math.max(MIN_COPIES, needed)));
    setDuration(copyWidth / speed);
  }, [speed]);

  useLayoutEffect(measure, [measure, children]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (copyRef.current) ro.observe(copyRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={viewportRef} className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        style={{
          ['--marquee-copies' as string]: String(copies),
          ...(duration != null ? { animationDuration: `${duration}s` } : {}),
        }}
      >
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? copyRef : undefined}
            aria-hidden={i === 0 ? undefined : 'true'}
            className="marquee-copy flex shrink-0 items-center gap-10 pr-10"
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}