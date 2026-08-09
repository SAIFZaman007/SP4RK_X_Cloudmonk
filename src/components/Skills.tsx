import { motion } from 'framer-motion';
import { skills } from '../data';
import SectionHeading from './SectionHeading';
import Icon, { type IconName } from './icons';
import { useInView } from '../hooks/useInView';

const categoryIcons: IconName[] = ['mesh', 'server', 'web', 'shield'];
const gradients = [
  'from-crimson to-crimson-dark',
  'from-steel to-steel-dark',
  'from-crimson-light to-crimson',
  'from-steel-light to-steel',
];

function SkillCard({ skill, idx }: { skill: (typeof skills)[0]; idx: number }) {
  const { ref, inView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-line bg-surface p-6 shadow-card"
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br text-bone ${
            gradients[idx % gradients.length]
          }`}
        >
          <Icon name={categoryIcons[idx % categoryIcons.length] ?? 'stack'} className="h-5 w-5" />
        </span>
        <h3 className="font-mono text-[13px] font-semibold uppercase tracking-wide text-fg">
          {skill.category}
        </h3>
      </div>
      <ul className="space-y-2.5 border-t border-line pt-4">
        {skill.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-fg-70">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-crimson" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading index="05" label="Capabilities" title="The toolkit" accent="toolkit" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, idx) => (
            <SkillCard key={skill.category} skill={skill} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
