import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll hook. Generic over the element type so consumers
 * can attach `ref` to a div/section without `as any` casts.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -48px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
