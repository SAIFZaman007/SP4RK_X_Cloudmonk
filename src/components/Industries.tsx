import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { industries } from '../data';

type Industry = (typeof industries)[number];

const SHOULDER_PX = 14;

const DEPTH_STEP = 0.045;

function IndustryCard({ item }: { item: Industry }) {
  return (
    <div
      className="relative aspect-5/4 overflow-hidden rounded-3xl border border-line shadow-panel sm:aspect-7/3"
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

      <div className="absolute inset-0 bg-linear-to-t/srgb from-black/85 via-black/30 to-transparent" />

      <span className="absolute left-6 top-5 font-display text-3xl font-semibold text-white/50 sm:text-4xl">
        {item.no}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
        <h4 className="font-display text-xl font-semibold tracking-tight text-white sm:text-3xl">
          {item.title}
        </h4>
        <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-white/80 sm:text-base sm:leading-6">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

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

  const targetScale = 1 - (total - 1 - index) * DEPTH_STEP;

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
        <ul className="max-w-content mx-auto mt-8 [&>:not([hidden])~:not([hidden])]:mt-6 px-6">
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