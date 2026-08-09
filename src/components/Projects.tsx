import { motion } from 'framer-motion';
import { projects } from '../data';
import SectionHeading from './SectionHeading';
import Icon from './icons';
import TiltCard from './motion/TiltCard';
import { useInView } from '../hooks/useInView';

const gradients = [
  'from-crimson to-crimson-dark',
  'from-steel to-steel-dark',
  'from-crimson-light to-crimson',
  'from-steel-light to-steel',
];

function ProjectCard({ proj, idx }: { proj: (typeof projects)[0]; idx: number }) {
  const { ref, inView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br text-bone shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${
              gradients[idx % gradients.length]
            }`}
          >
            <Icon name={proj.icon} className="h-5 w-5" />
          </span>
          {proj.url ? (
            <a
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${proj.title} in a new tab`}
              className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-fg-45 transition-colors duration-200 hover:text-crimson-light"
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
              className="rounded-md border border-line bg-surface-warm px-2 py-1 font-mono text-[10.5px] text-fg-70"
            >
              {tag}
            </span>
          ))}
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative py-20 sm:py-28">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading
          index="03"
          label="Selected Work"
          title="Systems I've shipped"
          accent="shipped"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((proj, idx) => (
            <ProjectCard key={proj.title} proj={proj} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
