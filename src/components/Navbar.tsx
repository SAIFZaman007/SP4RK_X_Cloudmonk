import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Download } from 'lucide-react';
import { site } from '../data';

// Wordmark is derived, never hardcoded - change site.url and it follows.
const domain = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
import { cn } from '../lib/utils';
import Magnetic from './motion/Magnetic';

const links = [
  { href: '#about', label: 'About', id: 'about' },
  { href: '#services', label: 'Services', id: 'services' },
  { href: '#work', label: 'Work', id: 'work' },
  { href: '#experience', label: 'Experience', id: 'experience' },
  { href: '#contact', label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // The pill indicator tracks hover when hovering, otherwise the active section.
  const highlighted = hovered ?? active;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-5"
      >
        <motion.nav
          animate={{
            backgroundColor: scrolled ? 'rgba(247,241,230,0.75)' : 'rgba(27,37,55,0.35)',
            borderColor: scrolled ? 'rgba(27,36,52,0.12)' : 'rgba(247,241,230,0.14)',
            boxShadow: scrolled
              ? '0 10px 40px -12px rgba(27,36,52,0.25)'
              : '0 10px 40px -12px rgba(13,19,30,0.5)',
          }}
          transition={{ duration: 0.4 }}
          className="flex w-full items-center justify-between gap-1 rounded-full border px-2 py-2 backdrop-blur-xl sm:w-auto sm:justify-start sm:gap-2 sm:px-3"
          aria-label="Primary"
        >
          {/* Wordmark */}
          <a
            href="#hero"
            className="group flex flex-shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 sm:pr-3"
          >
            <span className="grid h-8 w-8 flex-shrink-0 place-items-center overflow-hidden rounded-full shadow-sm ring-1 ring-bone/15 transition-transform duration-300 group-hover:scale-90">
              <img
                src="/logo-mark.png"
                alt="SZ logomark"
                className="h-full w-full object-cover"
                width={32}
                height={32}
              />
            </span>
            <span
              className={cn(
                'font-mono text-[13px] transition-colors',
                scrolled ? 'text-fg-70' : 'text-bone/80'
              )}
            >
              {domain}
            </span>
          </a>

          <span
            className={cn(
              'hidden h-5 w-px transition-colors md:block',
              scrolled ? 'bg-line' : 'bg-bone/15'
            )}
          />

          {/* Desktop links */}
          <div className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
            {links.map(({ href, label, id }) => (
              <a
                key={id}
                href={href}
                onMouseEnter={() => setHovered(id)}
                className={cn(
                  'relative rounded-full px-3.5 py-2 font-mono text-[13px] transition-colors duration-200 lg:px-4',
                  highlighted === id
                    ? scrolled
                      ? 'text-fg'
                      : 'text-bone'
                    : scrolled
                      ? 'text-fg-45 hover:text-fg'
                      : 'text-bone/55 hover:text-bone'
                )}
              >
                {highlighted === id && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className={cn(
                      'absolute inset-0 -z-10 rounded-full',
                      scrolled ? 'bg-crimson/12' : 'bg-bone/10'
                    )}
                  />
                )}
                <span className="relative">{label}</span>
              </a>
            ))}
          </div>

          {/* Resume CTA */}
          <Magnetic strength={0.3} className="hidden md:inline-block">
            <a
              href={site.cvLink}
              download
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-crimson to-crimson-dark px-4 py-2 font-mono text-[13px] text-bone shadow-sm transition-shadow duration-300 hover:shadow-glow"
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </a>
          </Magnetic>

          {/* Mobile trigger */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open menu"
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full transition-colors md:hidden',
                  scrolled ? 'text-fg-70 hover:bg-fg/5' : 'text-bone/80 hover:bg-bone/10'
                )}
              >
                <Menu className="h-5 w-5" />
              </button>
            </Dialog.Trigger>

            <AnimatePresence>
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[60] bg-coal-950/60 backdrop-blur-sm"
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild>
                    <motion.div
                      initial={{ opacity: 0, y: -16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.97 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="fixed inset-x-4 top-3 z-[70] rounded-3xl border border-line bg-bone/95 p-5 shadow-panel backdrop-blur-xl sm:top-5"
                    >
                      <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="grid h-8 w-8 flex-shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-line">
                            <img
                              src="/logo-mark.png"
                              alt="SZ logomark"
                              className="h-full w-full object-cover"
                              width={32}
                              height={32}
                            />
                          </span>
                          <span className="font-mono text-[13px] text-fg-70">{domain}</span>
                        </span>
                        <Dialog.Close asChild>
                          <button
                            aria-label="Close menu"
                            className="grid h-9 w-9 place-items-center rounded-full text-fg-45 transition-colors hover:bg-fg/5 hover:text-fg"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="flex flex-col">
                        {links.map(({ href, label }, i) => (
                          <motion.a
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.06 + i * 0.05 }}
                            className="rounded-2xl px-4 py-3 font-display text-lg font-medium text-fg transition-colors hover:bg-crimson/10 hover:text-crimson-light-light"
                          >
                            {label}
                          </motion.a>
                        ))}
                      </div>

                      <a
                        href={site.cvLink}
                        download
                        onClick={() => setOpen(false)}
                        className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-crimson to-crimson-dark px-4 py-3.5 font-mono text-sm text-bone"
                      >
                        <Download className="h-4 w-4" />
                        Download resume
                      </a>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </motion.nav>
      </motion.header>
    </>
  );
}