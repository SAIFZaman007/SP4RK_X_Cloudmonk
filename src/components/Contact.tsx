import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { site } from '../data';
import BlobField from './motion/BlobField';
import Magnetic from './motion/Magnetic';

export default function Contact() {
  const { ref, inView } = useInView();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="dark-panel relative overflow-hidden rounded-3xl border border-bone/10 p-8 text-center shadow-panel sm:p-14"
        >
          <BlobField className="opacity-70" />

          <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">
            Open to full-time &amp; contract
          </p>
          <h3 className="text-balance relative mt-4 font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
            Let's build something <span className="text-gradient-crimson">reliable</span>.
          </h3>
          <p className="text-balance relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-bone/65 sm:text-lg">
            Whether it's a new product to build, a role worth exploring, or a system that needs
            someone reliable on call - I'd be glad to hear from you.
          </p>

          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-crimson to-crimson-dark px-7 py-3.5 text-sm font-medium text-bone shadow-glow"
              >
                Say hello
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-bone/20 px-5 py-3.5 font-mono text-[13px] text-bone/80 transition-all duration-200 hover:border-bone/50 hover:bg-bone/5"
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.6}
                        d="M8 7h9a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2zm0 0V5a2 2 0 012-2h7"
                      />
                    </svg>
                    {site.email}
                  </>
                )}
              </button>
            </Magnetic>
          </div>

          <div className="relative mt-10 flex items-center justify-center gap-1 border-t border-bone/10 pt-8">
            <Magnetic strength={0.4}>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="grid h-10 w-10 place-items-center rounded-lg border border-bone/15 text-bone/70 transition-all duration-300 hover:border-crimson hover:text-crimson-light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
