import { useEffect, useState } from 'react';

export function useCountUp(target: number, active: boolean, duration = 1.1) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let raf = 0;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}
