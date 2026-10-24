import { motion } from 'framer-motion';
import { hero } from '../data';
import TickerBand from './motion/TickerBand';

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
