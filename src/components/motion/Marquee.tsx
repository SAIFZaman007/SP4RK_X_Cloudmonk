import type { ReactNode } from 'react';

export default function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track">
        <div className="flex flex-shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex flex-shrink-0 items-center gap-10 pr-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
