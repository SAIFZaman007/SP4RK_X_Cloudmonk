import { motion } from 'framer-motion';
import { skills } from '../data';
import SectionHeading from './SectionHeading';
import Icon, { type IconName } from './icons';
import FloatingCard from './motion/FloatingCard';
import { useInView } from '../hooks/useInView';

const categoryIcons: IconName[] = ['ai-ml', 'backend-eng', 'frontend-eng', 'devops-sec'];

function SkillCard({ skill, idx }: { skill: (typeof skills)[0]; idx: number }) {
  const { ref, inView } = useInView();

  return (
    // The reveal lives on this outer element and the float/magnetism inside
    // it. Both want a transform, and a `whileInView` animation that finishes
    // by writing `y: 0` would otherwise stamp over the idle float the moment
    // the card lands - the card would breathe until it entered, then stop.
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 34 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: idx * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <FloatingCard index={idx}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card transition-[border-color,box-shadow] duration-500 group-hover:border-gold/25 group-hover:shadow-card-hover">
          <div className="mb-4">
            <span className="mb-3 grid h-12 w-12 place-items-center text-gold transition-[transform,color] duration-500 group-hover:scale-110 group-hover:text-gold-light">
              <Icon
                name={categoryIcons[idx % categoryIcons.length] ?? 'ai-ml'}
                className="h-9 w-9"
              />
            </span>
            <h3 className="font-mono text-[13px] font-semibold uppercase tracking-wide text-fg">
              {skill.category}
            </h3>
          </div>

          <ul className="flex-1 space-y-2.5 border-t border-line pt-4">
            {skill.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-fg-70">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-crimson transition-colors duration-500 group-hover:bg-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </FloatingCard>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section-y relative">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading index="05" label="Capabilities" title="The toolkit" accent="toolkit" />

        {/* The magnetic pull reaches ~340px beyond each card, so the grid needs
            breathing room around it or a card's travel clips the section edge.
            items-stretch keeps every card the height of the tallest in its row
            even while they are individually floating out of alignment. */}
        <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, idx) => (
            <SkillCard key={skill.category} skill={skill} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
