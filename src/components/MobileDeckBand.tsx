import { motion } from 'framer-motion';
import { hero } from '../data';

/**
 * Below lg the hero's "Runs daily on" marquee is hidden (there's no room for
 * it inside the fold alongside copy, CTAs and stats). This carries it over,
 * wrapped instead of scrolling, right after the fold.
 */
export default function MobileDeckBand() {
  return (
    <section className="dark-panel relative overflow-hidden px-6 pb-8 pt-1 lg:hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-sm flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-bone/10 pt-5"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/35">
          Runs daily on
        </span>
        {hero.stack.map((tool) => (
          <span key={tool} className="font-display text-[12.5px] font-medium text-bone/60">
            {tool}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
