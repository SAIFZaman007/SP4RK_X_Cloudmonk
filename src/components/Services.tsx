import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { services } from '../data';
import SectionHeading from './SectionHeading';
import Icon from './icons';
import TiltCard from './motion/TiltCard';

/**
 * Receives the hero's card deck. At scroll progress 0 the four cards are
 * collapsed onto each other (still "stacked", mid-fall from the hero); as you
 * scroll they translate to their natural grid cells, de-rotate and settle.
 * Collapsing is expressed in percentages of each card's own width so it works
 * at any breakpoint without measuring layout.
 */

const CENTER = 1.5; // midpoint index of a 4-card row

function ServiceCard({
  svc,
  idx,
  progress,
  columns,
}: {
  svc: (typeof services)[0];
  idx: number;
  progress: MotionValue<number>;
  columns: number;
}) {
  // Where this card sits relative to the row's centre, in card-widths.
  const col = idx % columns;
  const rowCenter = (columns - 1) / 2;
  const dx = (rowCenter - col) * 106;
  const dy = idx >= columns ? -70 : -40;

  const x = useTransform(progress, [0, 0.75], [`${dx}%`, '0%']);
  const y = useTransform(progress, [0, 0.75], [dy, 0]);
  const rotate = useTransform(progress, [0, 0.75], [(idx - CENTER) * 5, 0]);
  const scale = useTransform(progress, [0, 0.75], [0.9, 1]);
  const opacity = useTransform(progress, [0, 0.28], [0, 1]);

  return (
    <motion.div style={{ x, y, rotate, scale, opacity }} className="h-full">
      <TiltCard className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
        <span className="grid h-12 w-12 place-items-center text-gold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon name={svc.icon} className="h-8 w-8" />
        </span>
        <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-fg">
          {svc.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-fg-70">{svc.desc}</p>
      </TiltCard>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.35'],
  });

  return (
    <section id="services" className="section-y relative">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading index="02" label="Services" title="What I can run for you" accent="run" />
        <p className="mb-10 max-w-2xl text-balance text-base leading-relaxed text-fg-70">
          Currently working full-time at <a href="https://www.maktechgroup.com" target="_blank" rel="noopener noreferrer" className="font-medium text-crimson-light underline-offset-4 transition-colors duration-200 hover:text-crimson hover:underline">Maktech</a>, dedicated to building scalable solutions that solve real product needs.
        </p>

        {/* Desktop: 4-up, cards deal out from a stack */}
        <div ref={ref} className="hidden gap-5 lg:grid lg:grid-cols-4">
          {services.map((svc, idx) => (
            <ServiceCard
              key={svc.title}
              svc={svc}
              idx={idx}
              progress={scrollYProgress}
              columns={4}
            />
          ))}
        </div>

        {/* Tablet: 2-up */}
        <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:hidden">
          {services.map((svc, idx) => (
            <ServiceCard
              key={svc.title}
              svc={svc}
              idx={idx}
              progress={scrollYProgress}
              columns={2}
            />
          ))}
        </div>

        {/* Mobile: single column, simple reveal (no horizontal deal - nowhere to fan to) */}
        <div className="grid gap-4 sm:hidden">
          {services.map((svc, idx) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 28, rotate: idx % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-line bg-surface p-5 shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center text-gold">
                <Icon name={svc.icon} className="h-8 w-8" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-fg">
                {svc.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-70">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
