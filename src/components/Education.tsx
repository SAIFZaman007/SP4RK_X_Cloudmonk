import { motion } from 'framer-motion';
import { education } from '../data';
import SectionHeading from './SectionHeading';
import { useInView } from '../hooks/useInView';

function EduRow({ edu, idx }: { edu: (typeof education)[0]; idx: number }) {
  const { ref, inView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col gap-1 border-b border-line py-5 pl-6 last:border-b-0 sm:flex-row sm:items-center sm:gap-6"
    >
      <span className="absolute left-0 top-7 h-2 w-2 rounded-full bg-line-strong transition-colors duration-300 group-hover:bg-crimson sm:top-1/2 sm:-translate-y-1/2" />
      <span className="w-24 flex-shrink-0 font-mono text-xs text-fg-45">{edu.graduated}</span>
      <div className="flex-1">
        <h3 className="text-base font-semibold leading-snug text-fg sm:text-lg">{edu.degree}</h3>
        <p className="mt-0.5 text-sm text-fg-70">{edu.school}</p>
      </div>
    </motion.div>
  );
}

export default function Education() {
  return (
    <section id="education" className="relative py-20 sm:py-12.5">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading index="07" label="Education" title="Where I studied" accent="studied" />
        <div>
          {education.map((edu, idx) => (
            <EduRow key={edu.degree} edu={edu} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
