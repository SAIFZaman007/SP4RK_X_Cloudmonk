import { useRef } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { hero, site } from '../data';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import HeroDeck from './HeroDeck';
import Magnetic from './motion/Magnetic';
import BlobField from './motion/BlobField';
import CloudField from './motion/CloudField';
import TickerBand from './motion/TickerBand';
import { cn, ctaGoldPill } from '../lib/utils';

const headlineVariants = {
  hidden: {},
  visible: {},
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Stat({
  number,
  suffix,
  label,
  active,
}: {
  number: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const count = useCountUp(number, active);
  return (
    <div>
      <div className="font-display text-2xl font-semibold text-bone sm:text-3xl">
        {count}
        {suffix}
      </div>
      <div className="mt-0.5 text-xs leading-snug text-bone/50">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { ref: statsRef, inView: statsInView } = useInView(0.4);
  const heroRef = useRef<HTMLDivElement>(null);
  const GLOW = 460;
  const glowX = useMotionValue(-GLOW);
  const glowY = useMotionValue(-GLOW);
  const springX = useSpring(glowX, { stiffness: 90, damping: 20 });
  const springY = useSpring(glowY, { stiffness: 90, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    glowX.set(e.clientX - rect.left - GLOW / 2);
    glowY.set(e.clientY - rect.top - GLOW / 2);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="dark-panel relative flex min-h-[100svh] flex-col overflow-hidden pb-5 pt-24 sm:pt-28 lg:pt-24 lg:pb-6"
      aria-label="Intro"
    >
      <CloudField />
      <BlobField />
      <motion.div
        className="pointer-events-none absolute left-0 top-0 hidden rounded-full opacity-25 mix-blend-screen md:block"
        style={{
          width: GLOW,
          height: GLOW,
          x: springX,
          y: springY,
          background: 'radial-gradient(circle, #DF3640 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-content relative mx-auto flex w-full flex-1 flex-col justify-center px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="hero-badge inline-flex items-center gap-2 rounded-full border border-bone/15 bg-bone/5 px-3 py-1.5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
              </span>
              {/* The company name is a real anchor inside the pill, not styled
                  text - so it is keyboard reachable and announced as a link.
                  `noopener noreferrer` is not optional on a target=_blank
                  outbound link: without it the opened tab gets a live
                  `window.opener` handle back into this document. */}
              <span className="font-mono text-[11px] tracking-wide text-bone/80">
                {hero.status.lead}{' '}
                <a
                  href={hero.status.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-medium text-crimson-light underline-offset-4 transition-colors duration-200 hover:text-crimson hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-coal-900"
                >
                  {hero.status.link.label}
                </a>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 font-mono text-[12px] uppercase tracking-[0.18em] text-bone/50 sm:text-[13px]"
            >
              {hero.eyebrow}
            </motion.p>

            {/* Size, family, weight and tracking live in .hero-headline
                (index.css). The fluid clamp there is too long to read inline,
                and keeping it in CSS puts it next to the short-viewport
                override that has to stay in step with it. */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={headlineVariants}
              className="hero-headline text-balance mt-2.5 text-bone"
            >
              {hero.headline.map((line, i) => (
                // overflow-hidden is the reveal mask for the line inside it;
                // the padding keeps that mask clear of the descenders (the "p"
                // in "products"), which sit ~3% of an em deeper in Sora.
                <span key={i} className="block overflow-hidden pb-1.5">
                  <motion.span
                    custom={i}
                    variants={lineVariants}
                    className={`inline-block ${i === hero.headline.length - 1 ? 'text-gradient-crimson' : ''}`}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* One-line promise, set between the headline and the proof
                paragraph. The leading rule replaces the literal dashes in the
                copy: a drawn hairline scales with the type and reuses the gold
                seam already used by the ticker and the footer, where a run of
                hyphens would be read aloud by a screen reader as punctuation
                and would not survive a font change. */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="mt-3.5 flex items-center gap-3 sm:mt-4"
            >
              <span
                className="gradient-divider-gold h-px w-8 flex-shrink-0 sm:w-11"
                aria-hidden="true"
              />
              <span className="text-gradient-gold font-mono text-[12px] font-medium leading-relaxed tracking-[0.02em] sm:text-[13.5px]">
                {hero.tagline}
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58 }}
              className="text-balance mt-4 max-w-lg text-[15px] leading-relaxed text-bone/65 sm:mt-5 sm:text-[17px]"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.68 }}
              className="mt-6 flex flex-wrap gap-3 sm:mt-7 sm:gap-4"
            >
              <Magnetic>
                <a href="#contact" className={cn('group', ctaGoldPill)}>
                  Get in touch
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a href={site.cvLink} download className={ctaGoldPill}>
                  Download resume
                </a>
              </Magnetic>
            </motion.div>

            {/* stats row */}
            <div
              ref={statsRef}
              className="mt-7 grid max-w-md grid-cols-3 gap-4 border-t border-bone/10 pt-5 sm:mt-8 sm:gap-6"
            >
              {hero.stats.map((s) => (
                <Stat
                  key={s.label}
                  number={s.number}
                  suffix={s.suffix}
                  label={s.label}
                  active={statsInView}
                />
              ))}
            </div>
          </div>

          {/* Right: floating card deck - deals out into the Services grid on scroll.
              Hidden below lg: a full viewport cannot hold the copy, CTAs, stats
              AND the deck without something getting clipped. Mobile gets its own
              compact deck band immediately below the fold instead. */}
          <div className="hidden w-full lg:block">
            <HeroDeck />
          </div>
        </div>
      </div>

      {/* runs daily on - a self-contained "ticker tape" strip, capped top and
          bottom by a thin gold seam so it reads as a distinct, premium band
          rather than a trailing footnote of the hero. Desktop only; mobile
          gets its own compact band in MobileDeckBand. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative mx-auto mt-6 hidden w-full max-w-content px-6 lg:block"
      >
        <TickerBand>
          {hero.stack.map((tool) => (
            <span key={tool} className="font-display text-sm font-medium text-bone/70">
              {tool}
            </span>
          ))}
        </TickerBand>
      </motion.div>
    </section>
  );
}
