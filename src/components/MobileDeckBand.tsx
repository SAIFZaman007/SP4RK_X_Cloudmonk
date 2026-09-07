import { motion } from 'framer-motion';
import { hero } from '../data';
import TickerBand from './motion/TickerBand';

/**
 * Below lg the hero's "Runs daily on" band is hidden - there is no room for it
 * inside the fold alongside copy, CTAs and stats. This carries it over just
 * after the fold.
 *
 * It now renders the same `TickerBand` the hero does, rather than a hand-built
 * lookalike. The previous copy had substituted a grey `border-t` for the gold
 * seam and dropped the bottom rail entirely, which is why the gold lining
 * "disappeared on mobile": it was never there. Parity is now structural - there
 * is one band component, so the two cannot diverge again.
 */
export default function MobileDeckBand() {
  return (
    <section className="dark-panel relative overflow-hidden px-6 pb-8 pt-1 lg:hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md pt-4"
      >
        <TickerBand>
          {hero.stack.map((tool) => (
            <span key={tool} className="font-display text-[13px] font-medium text-bone/65">
              {tool}
            </span>
          ))}
        </TickerBand>
      </motion.div>
    </section>
  );
}
