import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { about } from '../data';
import LanyardBadge from './LanyardBadge';
import MaktechLink from './MaktechLink';
import SectionHeading from './SectionHeading';

/**
 * Renders `**bold**` runs from the About copy as emphasised text.
 *
 * Replaces a `dangerouslySetInnerHTML` that was parsing raw HTML out of
 * data.ts. Nothing malicious was ever going to be in that file - it is copy the
 * author writes - but the pattern is worth removing on a site that otherwise
 * ships a strict CSP and an `object-src 'none'` policy: it is the one place
 * where editing a content file could inject markup, and the day that copy
 * starts coming from a CMS, a form, or a translation service, the vulnerability
 * arrives with it and nobody re-reads this component.
 *
 * Splitting on the delimiter and building real React nodes costs three lines
 * and removes the class of bug entirely. React escapes every text node it
 * renders, so the output cannot contain markup regardless of what the copy says.
 */
function Emphasised({ text }: { text: string }) {
  const tokens = text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-crimson-light">
              {token.slice(2, -2)}
            </strong>
          );
        }

        const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, href] = match;
          return (
            <MaktechLink key={i} href={href} className="font-medium">
              {label}
            </MaktechLink>
          );
        }

        return <span key={i}>{token}</span>;
      })}
    </>
  );
}

export default function About() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section-y relative">
      <div className="max-w-content mx-auto px-6">
        <SectionHeading
          index="01"
          label="Profile"
          title="Who's behind the architecture"
          accent="architecture"
        />

        <div ref={ref} className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
          {/* ID badge: a swinging 3D lanyard (lazy-loaded - see LanyardBadge).
              Same column, same entrance as the portrait it replaced. Capped at
              420px below md so it never balloons in the single-column layout. */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[420px] md:mx-0 md:max-w-none"
          >
            <LanyardBadge />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="[&>:not([hidden])~:not([hidden])]:mt-5">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-fg-70 sm:text-[1.0625rem]">
                  <Emphasised text={p} />
                </p>
              ))}
            </div>

            {/* quick facts */}
            <dl className="mt-9 grid grid-cols-1 gap-5 border-t border-line pt-7 sm:grid-cols-2">
              {about.quickFacts.map((f) => (
                <div key={f.label} className="border-l-2 border-crimson/30 pl-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-45">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-fg">
                    {typeof f.value === 'string' ? (
                      f.value
                    ) : f.value.href ? (
                      <MaktechLink href={f.value.href} className="text-sm">
                        {f.value.text}
                      </MaktechLink>
                    ) : (
                      f.value.text
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
