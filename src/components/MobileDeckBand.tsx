import { motion } from 'framer-motion';
import { hero } from '../data';
import Marquee from './motion/Marquee';

/**
 * Below lg the hero's "Runs daily on" band is hidden - there is no room for it
 * inside the fold alongside copy, CTAs and stats. This carries it over just
 * after the fold.
 *
 * It used to render the stack as a static wrapped list, which is why the
 * marquee appeared "broken on mobile": the animated component simply never
 * mounted below lg. It now uses the real Marquee, which also costs one line
 * instead of three and keeps the band inside a single row.
 */
export default function MobileDeckBand() {
  return (
    <section className="dark-panel relative overflow-hidden px-6 pb-8 pt-1 lg:hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md border-t border-bone/10 pt-5"
      >
        <span className="mb-2.5 block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-gold-light/60">
          Runs daily on
        </span>
        <Marquee speed={20}>
          {hero.stack.map((tool) => (
            <span key={tool} className="font-display text-[13px] font-medium text-bone/65">
              {tool}
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
