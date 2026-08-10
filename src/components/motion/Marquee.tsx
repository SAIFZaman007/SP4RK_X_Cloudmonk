import type { ReactNode } from 'react';

/**
 * Seamless infinite marquee.
 *
 * The track holds two identical copies of `children` and translates by exactly
 * -50%, so the second copy lands precisely where the first began - no visible
 * seam. The duplicate is aria-hidden so screen readers announce the list once.
 *
 * `speed` is seconds per full cycle. Shorter tracks (mobile) need a shorter
 * duration or the motion reads as drift rather than movement.
 */
export default function Marquee({ children, speed = 26 }: { children: ReactNode; speed?: number }) {
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <div className="flex flex-shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex flex-shrink-0 items-center gap-10 pr-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
