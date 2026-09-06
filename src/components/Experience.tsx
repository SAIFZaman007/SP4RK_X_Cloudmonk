import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { experience } from '../data';
import SectionHeading from './SectionHeading';
import { useInView } from '../hooks/useInView';

function ExperienceItem({ exp, idx }: { exp: (typeof experience)[0]; idx: number }) {
  const { ref, inView } = useInView();
  const isCurrent = idx === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative pb-10 pl-10 last:pb-0"
    >
      <span
        className={`absolute left-0 top-1.5 z-10 grid h-4 w-4 place-items-center rounded-full border-2 bg-surface-warm ${
          isCurrent ? 'border-crimson' : 'border-line-strong'
        }`}
      >
        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-crimson" />}
      </span>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3 className="text-lg font-semibold text-fg">{exp.role}</h3>
        {isCurrent && (
          <span className="rounded-full bg-gradient-to-r from-crimson to-crimson-dark px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-bone">
            current
          </span>
        )}
        <span className="font-mono text-xs text-fg-45">{exp.period}</span>
      </div>
      <div className="mt-1 font-mono text-sm text-crimson-light">{exp.company}</div>
      <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-fg-70 sm:text-base">{exp.desc}</p>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.8', 'end 0.6'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="section-y relative">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading index="04" label="Field Log" title="Where I've worked" accent="worked" />
        <div ref={containerRef} className="relative">
          <span className="absolute left-[7px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
          <motion.span
            style={{ scaleY }}
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-crimson via-crimson to-steel"
            aria-hidden="true"
          />
          {experience.map((exp, idx) => (
            <ExperienceItem key={exp.company + exp.period} exp={exp} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
