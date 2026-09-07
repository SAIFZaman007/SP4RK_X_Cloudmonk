import type { ReactNode } from 'react';
import Marquee from './Marquee';

/**
 * The "Runs daily on" ticker: a gold-railed band carrying the stack marquee.
 *
 * WHY THIS EXISTS AS A COMPONENT
 * ------------------------------
 * The band was previously built twice - inline in Hero for desktop, inline in
 * MobileDeckBand for mobile - and the two drifted. Mobile had picked up a plain
 * `border-t border-bone/10` instead of the gold seam, and had no bottom rail at
 * all, so the single most distinctive detail in the hero simply vanished on a
 * phone. That is what duplicated markup does over time; the fix is to have one
 * band, not two that are supposed to match.
 *
 * Everything that defines the band - both rails, the gold wash, the label, the
 * marquee velocity - lives here once. Only genuinely size-dependent values
 * (type scale, padding) vary, and they vary through Tailwind breakpoints inside
 * this file, so there is still exactly one place to change them.
 */
export default function TickerBand({
  label = 'Runs daily on',
  children,
  className = '',
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="gradient-divider-gold block h-px w-full" aria-hidden="true" />

      <div className="flex items-center gap-4 bg-gradient-to-b from-gold/[0.05] to-transparent py-3.5 sm:gap-6 sm:py-4">
        <span className="flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-light/70 sm:text-[11px]">
          {label}
        </span>
        {/* min-w-0 lets the mask shrink inside the flex row instead of forcing
            the band wider than its container on narrow screens. */}
        <Marquee className="min-w-0 flex-1">{children}</Marquee>
      </div>

      <span className="gradient-divider-gold block h-px w-full" aria-hidden="true" />
    </div>
  );
}
