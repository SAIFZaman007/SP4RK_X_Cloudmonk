import type { MouseEvent } from 'react';

/**
 * In-page navigation without hash routes.
 *
 * Every nav link keeps a real `href="#section"` - it is what makes the link
 * work with JavaScript off, for crawlers and for assistive tech - but a plain
 * click is intercepted here, so the address bar stays on the bare URL instead
 * of becoming `/#services`, `/#work`, and so on.
 *
 * Scrolling itself is left to the browser's own `scroll-behavior` (smooth,
 * and switched off by `prefers-reduced-motion`, both in index.css), and the
 * target is aligned using the same `scroll-padding-top` a native hash jump
 * uses, so the fixed navbar never covers a heading. Nothing is re-implemented.
 */

export const SECTION_IDS = ['hero', 'about', 'services', 'work', 'experience', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const isSectionId = (id: string): id is SectionId => (SECTION_IDS as readonly string[]).includes(id);

/** `behavior: 'auto'` (the default) defers to the CSS `scroll-behavior` on <html>. */
export function scrollToSection(id: SectionId, behavior: ScrollBehavior = 'auto'): void {
  if (id === 'hero') {
    // The hero is the top of the page; scrolling to 0 beats aligning its box
    // to the scroll-padding, which would stop short of the very top.
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
}

/**
 * onClick for an `<a href="#id">`. Modified clicks (new tab / window / save)
 * are left to the browser; a plain left click scrolls in place.
 */
export function onSectionClick(event: MouseEvent<HTMLElement>, id: SectionId): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  scrollToSection(id);
}

/** Drops "#whatever" from the address bar without adding a history entry. */
function dropHash(): void {
  try {
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search
    );
  } catch {
    // Sandboxed frames can forbid history writes. The URL is cosmetic; ignore.
  }
}

/**
 * Handles a hash that arrives from outside - an old bookmark, a shared
 * `/#contact` link, a hash typed into the address bar, or a ctrl-clicked nav
 * link opened in a new tab. It scrolls to the section, then removes the hash,
 * so the "no hash routes" rule holds for every way into the page.
 *
 * Call once, after the first render. Returns a teardown.
 */
export function installHashCleanup(): () => void {
  // `arrival` jumps instantly, like a native anchor does when a page opens on
  // one; a hash changed while the page is already open scrolls smoothly.
  const settle = (behavior: ScrollBehavior) => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    if (isSectionId(id)) scrollToSection(id, behavior);
    dropHash();
  };
  const onLoad = () => settle('instant');
  const onHashChange = () => settle('auto');

  // Wait for `load` on the first pass: fonts and images shift the layout, and
  // scrolling before they settle would land on the wrong spot.
  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });
  window.addEventListener('hashchange', onHashChange);

  return () => {
    window.removeEventListener('load', onLoad);
    window.removeEventListener('hashchange', onHashChange);
  };
}
