import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { site } from '../data';
import BlobField from './motion/BlobField';
import Magnetic from './motion/Magnetic';
import FloatingCard from './motion/FloatingCard';
import { cn, ctaGoldPill } from '../lib/utils';

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
    <section id="contact" className="section-y relative">
      <div className="max-w-3xl mx-auto px-6">
        {/* The panel itself is now the magnetic object, not just the buttons
            inside it.
            
            Tuned well below the service-card defaults, and for the same reason
            in each case: this element is roughly five times their area. A pull
            of 0.12 on a 700px panel is ~40px of travel, which slides the
            headline out from under the reader; 8deg of tilt across that span
            visibly skews the type at the far edge. At 0.045 and 3deg the panel
            leans toward the cursor as a heavy object would - the response is
            legible without the copy ever moving enough to chase.
            
            `radius` is widened to match: attraction should begin as the cursor
            enters the section, not once it is already over the panel, or the
            effect reads as a hover state rather than as proximity.
            
            Touch and reduced-motion users get a completely static panel -
            FloatingCard gates on `(hover: hover) and (pointer: fine)` and on
            `prefers-reduced-motion`, so no idle drift is scheduled at all. */}
        <FloatingCard
          radius={760}
          strength={0.045}
          tilt={3}
          floatAmplitude={6}
          spotlightClassName="rounded-3xl"
        >
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="dark-panel relative overflow-hidden rounded-3xl border border-bone/10 p-8 text-center shadow-panel sm:p-14"
          >
            {/* Photographic backdrop.
              The cloud motion that used to sit here has been removed: the
              image is itself a sky full of cloud, so an animated haze on top
              was two versions of the same idea fighting each other, and the
              drift kept pulling the eye off the headline it sits behind.

              The blur is doing real work, not decoration. At full sharpness the
              monk and the ridgeline are recognisable subjects and the eye reads
              them as content; blurred, the frame collapses into colour and
              light, which is what a backdrop is supposed to be. `scale-110`
              covers the soft, semi-transparent edge that `blur()` leaves around
              a filtered element - without it you get a visible pale border
              inside the panel's radius.

              BlobField stays. It is coloured light rather than form, so it
              layers over the photograph instead of competing with it. */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <img
                src="/cloudmonk.webp"
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-110 object-cover object-center blur-[6px] sm:blur-[1px]"
              />
              {/* Veil strength is measured, not eyeballed.
                The previous values (image at 42% under an 80% veil) left the
                photograph about 8% visible - effectively black, which is what
                was on screen. These were chosen by compositing the panel and
                checking every text zone against WCAG: eyebrow 5.5:1, headline
                3.1:1 (large text needs 3:1), body 5.6:1, buttons 8.1:1. That is
                the lightest veil where all four still pass, so lifting it
                further trades legibility for very little extra image. */}
              <div className="absolute inset-0 bg-gradient-to-b from-coal-950/40 via-coal-950/[0.34] to-coal-950/50" />
            </div>

            <BlobField className="opacity-60" />

            <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-bone/[0.62]">
              Currently working at{' '}
              <a
                href="https://www.maktechgroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-crimson-light underline-offset-4 transition-colors duration-200 hover:text-crimson hover:underline"
              >
                Maktech
              </a>
            </p>
            <h3 className="text-balance relative mt-4 font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
              Let's build something reliable.
            </h3>
            <p className="text-balance relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-bone/65 sm:text-lg">
              Whether it's a new product to build, a role worth exploring, or a system that needs
              someone reliable on call - I'd be glad to hear from you.
            </p>

            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <a href={`mailto:${site.email}`} className={cn('group px-7', ctaGoldPill)}>
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
                {/* aria-live, because the only feedback on success is the label
                  changing to "Copied" - a purely visual confirmation that a
                  screen reader would never announce, leaving the user unsure
                  whether the click did anything. */}
                <button
                  onClick={copyEmail}
                  aria-live="polite"
                  aria-label={
                    copied
                      ? 'Email address copied to clipboard'
                      : `Copy email address ${site.email}`
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-bone/20 px-5 py-3.5 font-mono text-[13px] text-bone/80 transition-all duration-200 hover:border-bone/50 hover:bg-bone/5"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
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
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
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

            <div className="relative mt-10 flex items-center justify-center gap-3 border-t border-bone/10 pt-8">
              {/* GitHub sits beside LinkedIn because for an engineering hire the
                repo list is the stronger artefact of the two, and `site.github`
                was already in data.ts with nothing rendering it. */}
              <Magnetic strength={0.4}>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-bone/15 text-bone/70 transition-all duration-300 hover:border-crimson hover:text-crimson-light"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.47-3.71-1.47-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.7-1.47-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1 .75 2.02v3c0 .29.2.64.76.53a10.53 10.53 0 0 0 7.5-10.44C23.02 5.24 18.27.5 12 .5z" />
                  </svg>
                </a>
              </Magnetic>
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
        </FloatingCard>
      </div>
    </section>
  );
}
