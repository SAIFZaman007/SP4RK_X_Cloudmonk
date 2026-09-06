import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { industries } from '../data';

/**
 * Vertical stacking slider, sitting directly under Services.
 *
 * HOW THE STACK WORKS
 * -------------------
 * Each card lives in a full-height wrapper that is `position: sticky`. As you
 * scroll, a card pins under the header while the next one rides up and settles
 * on top of it. The card underneath simultaneously scales down a few percent,
 * so its edges stay visible as a receding shoulder rather than being covered
 * outright - that peek is the whole effect. Without it the cards just replace
 * each other and the depth reads as a slideshow.
 *
 * The pinning itself is native `sticky`, not JavaScript. That matters: sticky is
 * handled by the compositor, so the pin never jitters or lags behind the scroll
 * the way a scroll-listener that sets `translateY` does. Framer Motion is used
 * only for the scale, which is genuinely scroll-linked and has no CSS
 * equivalent.
 *
 * WHY EACH CARD IS ITS OWN COMPONENT
 * ----------------------------------
 * `useTransform` is a hook, so it cannot be called inside `.map()`. Extracting
 * StackCard is what makes the per-card scroll binding legal rather than a
 * lint suppression - each card owns its own transform.
 *
 * REDUCED MOTION
 * --------------
 * The whole effect is scroll-coupled movement, which is exactly what
 * `prefers-reduced-motion` is asking us not to do. Rather than damp it, the
 * component falls back to a plain vertical list: same content, same order, no
 * pinning and no scaling. Vestibular-sensitive users get a page that simply
 * scrolls.
 */

function StackCard({
  item,
  index,
  total,
  progress,
}: {
  item: (typeof industries)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  /* Cards deeper in the stack end up smaller, so by the time the last one lands
     the pile reads as receding depth. 0.045 per step is enough to see and small
     enough that the text on a buried card never looks distorted. */
  const targetScale = 1 - (total - 1 - index) * 0.045;

  /* Scaling starts only once this card has arrived - before that its slice of
     the scroll range has not begun, so it sits at full size. */
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-[14vh] flex h-[74vh] items-start justify-center">
      <motion.article
        style={{
          scale,
          /* Each card parks a little lower than the one before, so the stack
             fans downward and every card's top edge stays visible. */
          top: `${index * 16}px`,
        }}
        className="relative w-full max-w-5xl origin-top"
      >
        <div
          className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line shadow-panel sm:aspect-[7/3]"
          style={{ backgroundImage: item.tint }}
        >
          {/* Layered over the tint rather than replacing it, so a missing file
              degrades to a designed gradient instead of a broken-image glyph. */}
          <img
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Contrast floor for the copy, anchored bottom-left so the rest of
              the photograph stays at full brightness. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <span className="absolute left-6 top-5 font-display text-3xl font-semibold text-white/50 sm:text-4xl">
            {item.no}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
            <h4 className="font-display text-xl font-semibold tracking-tight text-white sm:text-3xl">
              {item.title}
            </h4>
            <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-white/80 sm:text-base">
              {item.desc}
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Industries() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* 'start start' -> 'end end' maps progress across the container's own scroll
     runway, which is what makes each card's slice (index/total) line up with
     the moment it actually pins. */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section id="industries" className="section-y relative" aria-labelledby="industries-heading">
      <div className="max-w-content mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-45">Industries</p>
        <h3
          id="industries-heading"
          className="mt-2 font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl"
        >
          The kind of <span className="text-gradient-crimson">products I build</span>
        </h3>
      </div>

      {reduce ? (
        <ul className="max-w-content mx-auto mt-8 space-y-6 px-6">
          {industries.map((item) => (
            <li key={item.no} className="relative">
              <div
                className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line shadow-panel sm:aspect-[7/3]"
                style={{ backgroundImage: item.tint }}
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <span className="absolute left-6 top-5 font-display text-3xl font-semibold text-white/50">
                  {item.no}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <h4 className="font-display text-xl font-semibold tracking-tight text-white sm:text-3xl">
                    {item.title}
                  </h4>
                  <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-white/80 sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div ref={containerRef} className="mt-6 px-6">
          {industries.map((item, i) => (
            <StackCard
              key={item.no}
              item={item}
              index={i}
              total={industries.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      )}
    </section>
  );
}
