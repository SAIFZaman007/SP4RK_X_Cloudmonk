import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { industries } from '../data';

type Industry = (typeof industries)[number];

/**
 * Vertical stacking slider, sitting directly under Services.
 *
 * HOW THE STACK WORKS
 * -------------------
 * Each card lives in a `position: sticky` slot. As you scroll, a card pins
 * under the header while the next one rides up and settles on top of it. The
 * card underneath simultaneously scales down a few percent, so its edges stay
 * visible as a receding shoulder rather than being covered outright - that peek
 * is the whole effect. Without it the cards just replace each other and the
 * depth reads as a slideshow.
 *
 * The pinning itself is native `sticky`, not JavaScript. That matters: sticky
 * is handled by the compositor, so the pin never jitters or lags behind the
 * scroll the way a scroll-listener that sets `translateY` does. Framer Motion
 * is used only for the scale, which is genuinely scroll-linked and has no CSS
 * equivalent.
 *
 * WHY THE SLOTS HAVE NO HEIGHT OF THEIR OWN
 * -----------------------------------------
 * They used to be `h-[74vh]`, while the card inside them is a 7:3 box that
 * comes out around 440px tall. On a 1000px viewport that left ~300px of empty
 * slot underneath every card - dead space that only became visible mid-scroll,
 * once a slot had left the sticky zone and the next card had not yet arrived.
 * That is the enormous gap between cards, and the same arithmetic on the final
 * slot is the enormous gap before "Selected Work": the section was reserving a
 * screen and a half of runway for content half that tall.
 *
 * Slots are now auto-height, so a slot is exactly as tall as its card and the
 * next card begins the pixel after the previous one ends - no gap to tune, at
 * any viewport height, because there is no second number that has to agree with
 * the card's aspect ratio. The scroll runway per card is one card height, which
 * is also what makes the cadence feel proportional to the cards themselves.
 *
 * The fan is produced by giving each slot a slightly larger sticky `top`, so
 * card n pins SHOULDER_PX below card n-1 and every card's top edge stays
 * visible. Doing it with the sticky offset rather than a relative `top` on the
 * card keeps layout and paint in agreement - a relative offset would move the
 * card visually while leaving its slot behind, reintroducing the gap it was
 * meant to close.
 *
 * REDUCED MOTION
 * --------------
 * The whole effect is scroll-coupled movement, which is exactly what
 * `prefers-reduced-motion` is asking us not to do. Rather than damp it, the
 * component falls back to a plain vertical list: same content, same order, no
 * pinning and no scaling. Vestibular-sensitive users get a page that simply
 * scrolls.
 */

/** Visible top edge of each buried card, in px. The whole fan is this number. */
const SHOULDER_PX = 14;

/** Scale lost per card of depth. Enough to see; small enough not to distort. */
const DEPTH_STEP = 0.045;

/**
 * The card face. Shared by both the stacked and the reduced-motion branch so
 * the two cannot drift - previously this markup existed twice and any change
 * had to be made in both places to stay honest.
 */
function IndustryCard({ item }: { item: Industry }) {
  return (
    <div
      /* 5/4 below sm, not 16/9.
       *
       * Two reasons, and they are the same reason. At 393px wide a 16/9 card is
       * 194px tall, and p-6 plus a title plus three lines of description does
       * not comfortably fit in 194px - the copy was running to the edge of its
       * own contrast gradient. That same 194px is also the card's entire scroll
       * runway now that a slot is one card tall, which is not enough distance
       * for the stack to read as anything but a jump cut.
       *
       * 5/4 gives 276px: the copy breathes and the effect has room to play.
       * Desktop is unchanged. Revert by restoring `aspect-[16/9]`. */
      className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-line shadow-panel sm:aspect-[7/3]"
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

      {/* Contrast floor for the copy, anchored bottom-left so the rest of the
          photograph stays at full brightness. */}
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
  );
}

/**
 * WHY EACH CARD IS ITS OWN COMPONENT
 * ----------------------------------
 * `useTransform` is a hook, so it cannot be called inside `.map()`. Extracting
 * StackCard is what makes the per-card scroll binding legal rather than a lint
 * suppression - each card owns its own transform.
 */
function StackCard({
  item,
  index,
  total,
  progress,
}: {
  item: Industry;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  /* Cards deeper in the stack end up smaller, so by the time the last one lands
     the pile reads as receding depth. */
  const targetScale = 1 - (total - 1 - index) * DEPTH_STEP;

  /* Scaling starts once this card has arrived and finishes when the LAST card
     lands, not at progress 1.
     
     With slots that are one card tall, card i pins after roughly i card-heights
     of scroll, so its arrival sits at i/total of the container - and the final
     card arrives at (total-1)/total, with the remaining slice being the tail
     that holds the finished stack on screen. Mapping the shrink to 1 instead
     would leave every buried card still mid-transition at the exact moment the
     stack is fully composed, which is the one frame the effect exists for. */
  const scale = useTransform(progress, [index / total, (total - 1) / total], [1, targetScale], {
    clamp: true,
  });

  return (
    <div className="sticky" style={{ top: `calc(var(--stack-top) + ${index * SHOULDER_PX}px)` }}>
      <motion.article style={{ scale }} className="mx-auto w-full max-w-5xl origin-top">
        <IndustryCard item={item} />
      </motion.article>
    </div>
  );
}

export default function Industries() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* 'start start' -> 'end start': progress runs from the container reaching the
     top of the viewport to the container leaving through it.
     
     'end end' - the previous offset - measured against the viewport's *bottom*,
     so progress hit 1 while the last two cards were still on their way up, and
     the scale ran out early. Measuring against the top is what makes a card's
     slice (index/total) coincide with the moment it actually pins, because
     pinning is itself a top-of-viewport event. */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  return (
    <section
      id="industries"
      className="section-y section-y--stacked relative"
      aria-labelledby="industries-heading"
    >
      <div className="max-w-content mx-auto px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-45">Industries</p>
        <h3
          id="industries-heading"
          className="mt-2 font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl"
        >
          The <span className="text-gradient-crimson">kind of products</span> I build
        </h3>
      </div>

      {reduce ? (
        <ul className="max-w-content mx-auto mt-8 space-y-6 px-6">
          {industries.map((item) => (
            <li key={item.no} className="mx-auto w-full max-w-5xl">
              <IndustryCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div ref={containerRef} className="industries-stack mt-6 px-6">
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
