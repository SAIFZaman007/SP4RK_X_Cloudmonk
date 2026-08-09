import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials as allTestimonials } from '../data';
import SectionHeading from './SectionHeading';
import { useInView } from '../hooks/useInView';

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AUTOPLAY_MS = 6000;

// Real, named people are credited here. Nothing renders until a quote is
// actually written by them - an empty or half-filled carousel reads worse
// than no section at all, and a placeholder quote would be fabrication.
const MIN_TESTIMONIALS = 3;
const testimonials = allTestimonials.filter((t) => t.quote.trim().length > 0);

export default function Testimonials() {
  const { ref, inView } = useInView(0.3);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!inView || paused) return;
    const t = setInterval(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [inView, paused, index, go]);

  const current = testimonials[index];

  if (testimonials.length < MIN_TESTIMONIALS || !current) return null;

  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading index="06" label="Client Notes" title="What people say" accent="say" />

        <div
          ref={ref}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mx-auto max-w-2xl"
        >
          <motion.div
            layout
            transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
          >
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col p-8 sm:p-10"
              >
                <span
                  className="font-display text-4xl leading-none text-crimson/40"
                  aria-hidden="true"
                >
                  “
                </span>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-70 sm:text-base">
                  {current.quote}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-crimson to-crimson-dark font-mono text-xs font-medium text-bone">
                    {initials(current.name)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-fg">{current.name}</div>
                    <div className="text-xs text-fg-45">
                      {current.role}
                      <span className="text-fg-25"> · </span>
                      <span className="text-crimson-light">{current.company}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              onClick={() => go(index - 1, -1)}
              aria-label="Previous testimonial"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg-45 transition-colors hover:border-crimson hover:text-crimson-light"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="p-1.5"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? 'w-6 bg-crimson' : 'w-1.5 bg-line-strong'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => go(index + 1, 1)}
              aria-label="Next testimonial"
              className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-fg-45 transition-colors hover:border-crimson hover:text-crimson-light"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            {/* Invisible spacer, mobile only: the fixed back-to-top button sits
                bottom-right, and this row is otherwise perfectly centered - which
                can put the next-arrow directly under it. Biases the group left. */}
            <span className="w-9 flex-shrink-0 sm:hidden" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
