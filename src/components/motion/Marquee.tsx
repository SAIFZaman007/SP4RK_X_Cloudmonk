import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Seamless infinite marquee.
 *
 * WHY THE OLD VERSION STUTTERED ONCE PER LOOP
 * -------------------------------------------
 * It rendered exactly two copies and translated the track by -50%, i.e. by one
 * copy's width. That is seamless only while a single copy is at least as wide
 * as the visible window. It was not: the eight stack labels measure roughly
 * 900px and the desktop band gives them ~950px, so at the end of every cycle
 * the second copy had slid fully into view but still ended short of the right
 * edge - a sliver of empty band - and then the animation restarted and both
 * copies snapped back in. That snap is the "glitch", and it fired exactly once
 * per loop because it *was* the loop. Mobile never showed it (a ~450px window
 * is narrower than one copy), which is why it read as a desktop-only bug rather
 * than as a sizing bug.
 *
 * THE FIX
 * -------
 * Render as many copies as it takes to keep the track wider than the window
 * plus one full copy: `ceil(window / copy) + 1`, floored at 2. Shifting by
 * exactly one copy width then always lands a later copy precisely where the
 * previous one started, with content still filling the window at the moment it
 * happens - so the restart is unobservable no matter how short the content or
 * how wide the screen.
 *
 * The shift is expressed as `-100% / copies`, a percentage of the track's own
 * width, so it stays exact under fractional layout widths. Computing it in
 * pixels would round, and a half-pixel error at the seam shows as a one-frame
 * twitch.
 *
 * WHY SPEED IS PX/SEC, NOT SECONDS
 * --------------------------------
 * Seconds-per-cycle means a narrow track and a wide one move at different
 * speeds - the mobile band and the desktop band visibly disagreed. Velocity is
 * the property that should be constant across breakpoints, so it is the one
 * that is configured, and the duration is derived from the measured width. One
 * value now produces identical motion on every device.
 *
 * SSR
 * ---
 * Renders two copies with a width-derived percentage shift on the server, so
 * the pre-hydration paint is already a valid, animating marquee. Measurement
 * refines the copy count on the client before paint (`useLayoutEffect`), so
 * there is no flash of a wrong layout.
 */

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

    // getBoundingClientRect, not offsetWidth: the copy can sit at a fractional
    // width and offsetWidth rounds, which would bias the copy count at exactly
    // the boundary where it matters most.
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
    // Observes both boxes: the window can change without the content changing
    // (rotation, resize) and the content can change without the window changing
    // (a web font swapping in and re-measuring the labels).
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
          // Left unset until measured, so the stylesheet's own default applies
          // to the first paint instead of a jump from an invented value.
          ...(duration != null ? { animationDuration: `${duration}s` } : {}),
        }}
      >
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            // Only the first copy is real content; the rest are visual padding
            // and must not be announced or placed in the focus order.
            ref={i === 0 ? copyRef : undefined}
            aria-hidden={i === 0 ? undefined : 'true'}
            className="marquee-copy flex flex-shrink-0 items-center gap-10 pr-10"
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
