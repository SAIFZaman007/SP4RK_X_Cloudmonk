import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './motion/Magnetic';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Magnetic strength={0.4}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface text-fg-70 shadow-card transition-colors duration-300 hover:border-crimson hover:text-crimson-light"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
