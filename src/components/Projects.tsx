import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { projects } from '../data';
import SectionHeading from './SectionHeading';
import Icon from './icons';
import TiltCard from './motion/TiltCard';
import { useInView } from '../hooks/useInView';

function ProjectCard({ proj, idx }: { proj: (typeof projects)[0]; idx: number }) {
  const { ref, inView } = useInView();
  const cardRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const reveal = useSpring(useMotionValue(0), { stiffness: 140, damping: 24 });

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const holeRadius = useTransform(reveal, [0, 1], [0, 300]);
  const scrimMask = useMotionTemplate`radial-gradient(${holeRadius}px circle at ${mx}% ${my}%, transparent 5%, black 72%)`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <TiltCard className="group relative h-full rounded-2xl">
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseEnter={() => reveal.set(1)}
          onMouseLeave={() => reveal.set(0)}
          className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line shadow-card transition-[border-color,box-shadow] duration-500 group-hover:border-gold/45 group-hover:shadow-card-glow"
        >

          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <picture>
              <source srcSet={proj.imageWebp} type="image/webp" />
              <img
                src={proj.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.02] object-cover opacity-[0.55] grayscale-[0.35] transition-[opacity,filter,scale] duration-650 ease-out will-change-[opacity,scale] group-hover:scale-[1.08] group-hover:opacity-[0.92] group-hover:grayscale-0 group-hover:saturate-[1.15] group-hover:brightness-110"
              />
            </picture>

            <motion.div
              className="absolute inset-0 bg-surface/[0.55] transition-colors duration-650 group-hover:bg-surface/22"
              style={{ WebkitMaskImage: scrimMask, maskImage: scrimMask }}
            />

            <div className="absolute inset-0 bg-linear-to-t/srgb from-surface via-surface/70 to-transparent transition-opacity duration-650 group-hover:from-surface group-hover:via-surface/80" />
          </div>

          <div className="relative flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center text-gold transition-[scale,color] duration-500 group-hover:scale-110 group-hover:text-gold-light">
                <Icon name={proj.icon} className="h-8 w-8" />
              </span>
              {proj.url ? (
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${proj.title} in a new tab`}
                  className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 font-mono text-[11px] text-fg-45 transition-colors duration-200 hover:border-gold/40 hover:text-gold-light"
                >
                  Live
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    &#8599;
                  </span>
                </a>
              ) : (
                <span className="mt-1 font-mono text-[11px] text-fg-25">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              )}
            </div>

            <h3 className="mt-4 text-base font-semibold leading-snug text-fg sm:text-lg sm:leading-7">
              {proj.title}
            </h3>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-70">{proj.desc}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {proj.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-line bg-surface-warm/85 px-2 py-1 font-mono text-[10.5px] text-fg-70 backdrop-blur-xs transition-colors duration-500 group-hover:border-line-strong"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="section-y relative">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading
          index="03"
          label="Selected Work"
          title="Systems I've shipped"
          accent="Systems"
        />
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj, idx) => (
            <ProjectCard key={proj.title} proj={proj} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}