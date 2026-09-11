import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { Mail, ArrowUpRight } from 'lucide-react';
import { site } from '../data';
import CloudField from './motion/CloudField';

// lucide v1 dropped brand marks, so LinkedIn ships inline.
function LinkedinMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function GithubMark({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
    </svg>
  );
}

const nav = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const SPOT = 520;

function DhakaClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Dhaka',
        }).format(new Date())
      );
    tick();
    const t = setInterval(tick, 1000 * 30);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  // Cursor spotlight. framer's x/y occupy the same transform slot as
  // translateX/Y, so centring has to happen in the value, not in CSS.
  const sx = useMotionValue(-SPOT);
  const sy = useMotionValue(-SPOT);
  const springX = useSpring(sx, { stiffness: 90, damping: 20 });
  const springY = useSpring(sy, { stiffness: 90, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    sx.set(e.clientX - r.left - SPOT / 2);
    sy.set(e.clientY - r.top - SPOT / 2);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const markY = useTransform(scrollYProgress, [0, 1], [70, 0]);

  return (
    <footer
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        sx.set(-SPOT);
        sy.set(-SPOT);
      }}
      className="dark-panel relative isolate mt-8 overflow-hidden rounded-t-[2rem] sm:rounded-t-[3rem]"
    >
      {/* Drifting haze, sitting under everything else in the footer.
          `isolate` on the footer already creates a stacking context, and the
          gold seam below carries z-10, so this stays behind the seam and the
          content without needing a z-index of its own.

          The footer is the one place on the page where slow ambient motion is
          unambiguously right: there is nothing here to read closely, so drift
          reads as atmosphere rather than as a distraction competing with copy. */}
      <CloudField className="opacity-70" />

      {/* Gold seam capping the top edge - the same premium hairline used on
          the hero ticker, so the two "expensive" details in the page read as
          one deliberate motif rather than a one-off. */}
      <span
        className="gradient-divider-gold absolute inset-x-0 top-0 z-10 h-px w-full"
        aria-hidden="true"
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-10 hidden rounded-full opacity-[0.18] mix-blend-screen md:block"
        style={{
          width: SPOT,
          height: SPOT,
          x: springX,
          y: springY,
          background: 'radial-gradient(circle, #DF3640 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <div className="max-w-content mx-auto px-6 pt-16 sm:pt-20">
        {/* Top row */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-14 w-14 flex-shrink-0 place-items-center sm:h-16 sm:w-16">
                <img
                  src="/logo-mark.png"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                  width={64}
                  height={64}
                />
              </span>
              <span className="font-headline text-lg font-bold tracking-wide text-bone">
                {site.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/55">
              AI-SaaS engineer shipping full-stack AI products end to end. Full-time Software Professional at{' '}
              <a
                href="https://www.maktechgroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-crimson-light underline-offset-4 transition-colors duration-200 hover:text-crimson hover:underline"
              >
                Maktech
              </a>
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-xl border border-bone/12 text-bone/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson hover:text-crimson-light"
              >
                <LinkedinMark />
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-10 w-10 place-items-center rounded-xl border border-bone/12 text-bone/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson hover:text-crimson-light"
              >
                <GithubMark />
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-xl border border-bone/12 text-bone/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson hover:text-crimson-light"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/35">
              Navigate
            </h4>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="group inline-flex items-center gap-1 text-sm text-bone/60 transition-colors hover:text-bone"
                  >
                    <span className="relative">
                      {n.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-crimson transition-all duration-300 group-hover:w-full" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/35">
              Get in touch
            </h4>
            <a
              href={`mailto:${site.email}`}
              className="group mt-4 inline-flex items-center gap-1.5 font-mono text-sm text-bone/80 transition-colors hover:text-crimson-light"
            >
              {site.email}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <div className="mt-4 flex items-center gap-2 font-mono text-xs text-bone/45">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crimson" />
              </span>
              Dhaka, BD - <DhakaClock /> local
            </div>
          </div>
        </div>

        {/* Oversized wordmark - the brand handle (SP4RK), not the legal name.
            The copyright line below carries the legal name; this is signage. */}
        <motion.div
          style={{ y: markY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none relative mt-10 select-none"
          aria-hidden="true"
        >
          <span
            className="absolute inset-0 bg-gradient-to-t from-gold/[0.10] via-transparent to-transparent blur-2xl"
            aria-hidden="true"
          />
          <span className="relative block bg-gradient-to-b from-bone/35 to-bone/[0.05] bg-clip-text text-center font-headline text-[15vw] font-bold leading-[0.85] tracking-wordmark text-transparent">
            {site.brand}
          </span>
        </motion.div>

        {/* Bottom bar.
            The last line before a visitor leaves is prime real estate, so it
            carries the thesis of the work rather than a framework credit list
            or a fourth call to action. Centred and given its own line: a
            statement squeezed into the right-hand slot of a justify-between
            row reads as a footnote, which is the opposite of the intent. */}
        <div className="relative mt-8 pb-20 pt-8 sm:pb-8">
          <span
            className="gradient-divider-gold absolute inset-x-0 top-0 h-px w-full opacity-40"
            aria-hidden="true"
          />

          <blockquote className="mx-auto flex max-w-2xl items-center justify-center gap-4">
            {/* Hairlines flank the quote rather than underline it, so the
                sentence is framed by the same gold seam that caps the hero
                ticker and this footer's top edge. Dropped below sm, where
                they would leave the text ~120px to wrap inside. */}
            <span
              className="gradient-divider-gold hidden h-px min-w-0 flex-1 opacity-60 sm:block"
              aria-hidden="true"
            />
            <p className="quote-sheen font-headline text-center text-[12.5px] font-medium leading-relaxed tracking-[0.02em] sm:text-[13.5px]">
              “{site.quote}”
            </p>
            <span
              className="gradient-divider-gold hidden h-px min-w-0 flex-1 opacity-60 sm:block"
              aria-hidden="true"
            />
          </blockquote>

          <p className="mt-6 text-center font-mono text-[11px] text-bone/35 sm:text-xs">
            © {year} {site.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}