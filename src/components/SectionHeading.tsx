import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface Props {
  index: string; // "01"
  label: string; // eyebrow, e.g. "PROFILE"
  title: string; // big display title
  accent?: string; // substring of title to render in crimson
}

export default function SectionHeading({ index, label, title, accent }: Props) {
  const { ref, inView } = useInView();

  const renderTitle = () => {
    if (!accent) return title;
    const i = title.indexOf(accent);
    if (i === -1) return title;
    return (
      <>
        {title.slice(0, i)}
        <span className="text-gradient-crimson">{accent}</span>
        {title.slice(i + accent.length)}
      </>
    );
  };

  return (
    <div ref={ref} className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2.5"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-crimson/10 font-mono text-[11px] font-medium text-crimson-light">
          {index}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-45">
          {label}
        </span>
      </motion.div>
      <div className="mt-4 flex items-center gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-display text-3xl font-semibold tracking-tightest text-fg sm:text-4xl"
        >
          {renderTitle()}
        </motion.h2>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
          className="hidden h-px flex-1 gradient-divider sm:block"
        />
      </div>
    </div>
  );
}
