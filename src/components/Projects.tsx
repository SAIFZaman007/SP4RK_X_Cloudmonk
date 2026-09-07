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

  // Card-local spotlight. Unlike the Toolkit's magnetic cards this needs no
  // proximity field - the effect only means anything once the cursor is
  // actually over the artwork - so a plain local handler is the cheaper and
  // more predictable choice.
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

  // A soft hole punched in the scrim under the cursor. The image is uniformly
  // brighter on hover; this makes the patch the cursor is actually on brighter
  // still, so the reveal feels directed rather than switched on.
  //
  // The hole's radius is driven by `reveal` rather than its opacity, so at rest
  // the radius is 0, the gradient degenerates to solid black, and the scrim is
  // fully intact. Animating opacity instead would leave a permanent bright
  // patch at the card's centre whenever the cursor was not over it.
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
          {/* Background artwork.
              At rest it is a dim, desaturated texture. On hover it comes up to
              near-full brightness, regains colour and pushes in slightly.
              Three separate properties rather than one: opacity alone just
              makes a grey image less grey, and the saturate/brightness pass is
              what actually makes the shot read as a photograph. */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <picture>
              <source srcSet={proj.imageWebp} type="image/webp" />
              <img
                src={proj.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.02] object-cover opacity-[0.55] grayscale-[0.35] transition-[opacity,filter,transform] duration-[650ms] ease-out will-change-[opacity,transform] group-hover:scale-[1.08] group-hover:opacity-[0.92] group-hover:grayscale-0 group-hover:saturate-[1.15] group-hover:brightness-110 group-hover:contrast-105"
              />
            </picture>

            {/* Flat scrim. Lifts substantially on hover so the image can come
                through, and is masked out under the cursor for the local
                brightening. */}
            <motion.div
              className="absolute inset-0 bg-surface/[0.55] transition-colors duration-[650ms] group-hover:bg-surface/[0.22]"
              style={{ WebkitMaskImage: scrimMask, maskImage: scrimMask }}
            />

            {/* Contrast floor. This is the part that makes the brighter image
                safe: as the flat scrim lifts, a bottom-anchored gradient
                *deepens* underneath the type. Brightness goes up where the
                artwork lives and stays put where the words are, so the copy
                holds its contrast ratio at every point of the transition
                instead of washing out at the peak of it. */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent transition-opacity duration-[650ms] group-hover:from-surface group-hover:via-surface/80" />
          </div>

          <div className="relative flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center text-gold transition-[transform,color] duration-500 group-hover:scale-110 group-hover:text-gold-light">
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

            <h3 className="mt-4 text-base font-semibold leading-snug text-fg sm:text-lg">
              {proj.title}
            </h3>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-fg-70">{proj.desc}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {proj.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-line bg-surface-warm/85 px-2 py-1 font-mono text-[10.5px] text-fg-70 backdrop-blur-sm transition-colors duration-500 group-hover:border-line-strong"
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
