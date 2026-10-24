import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { about } from '../data';
import LanyardBadge from './LanyardBadge';
import MaktechLink from './MaktechLink';
import SectionHeading from './SectionHeading';

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
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-105 md:mx-0 md:max-w-none"
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