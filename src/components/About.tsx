import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { about, site } from '../data';
import SectionHeading from './SectionHeading';

export default function About() {
  const { ref, inView } = useInView();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading index="01" label="Profile" title="Who's behind the rack" accent="rack" />

        <div ref={ref} className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-56 md:mx-0 md:w-full"
          >
            <div
              ref={frameRef}
              className="relative rounded-2xl bg-gradient-to-br from-crimson via-crimson-light to-steel p-[3px] shadow-card"
            >
              {/* aspect-[4/4.85] (was 4/5) plus dropping the old scale-110 zoom
                  gives the crop enough headroom that the hairline never gets
                  clipped, on any viewport - object-top keeps the head as the
                  anchor if the frame is ever squeezed narrower than this. */}
              <motion.div
                style={{ y }}
                className="relative aspect-[4/4.85] overflow-hidden rounded-[15px] bg-coal-900"
              >
                <picture>
                  <source srcSet={about.imageWebp} type="image/webp" />
                  <img
                    src={about.image}
                    alt={`${site.name} - ${site.role}`}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    width={480}
                    height={600}
                  />
                </picture>
              </motion.div>
            </div>
            <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-fg-45">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson" />
              <span className="font-display text-[13px] font-medium tracking-wide text-fg-70">
                {site.legalName}
              </span>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-fg-70 sm:text-[1.0625rem] [&_strong]:font-semibold [&_strong]:text-crimson-light"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </div>

            {/* quick facts */}
            <dl className="mt-9 grid grid-cols-1 gap-5 border-t border-line pt-7 sm:grid-cols-2">
              {about.quickFacts.map((f) => (
                <div key={f.label} className="border-l-2 border-crimson/30 pl-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-45">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-fg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}