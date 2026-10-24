import type { ReactNode } from 'react';
import Marquee from './Marquee';

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

      <div className="flex items-center gap-4 bg-linear-to-b/srgb from-gold/5 to-transparent py-3.5 sm:gap-6 sm:py-4">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-light/70 sm:text-[11px]">
          {label}
        </span>

        <Marquee className="min-w-0 flex-1">{children}</Marquee>
      </div>

      <span className="gradient-divider-gold block h-px w-full" aria-hidden="true" />
    </div>
  );
}