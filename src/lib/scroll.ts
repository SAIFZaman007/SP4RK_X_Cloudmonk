import type { MouseEvent } from 'react';

export const SECTION_IDS = ['hero', 'about', 'services', 'work', 'experience', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const isSectionId = (id: string): id is SectionId => (SECTION_IDS as readonly string[]).includes(id);

export function scrollToSection(id: SectionId, behavior: ScrollBehavior = 'auto'): void {
  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
}

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

export function installHashCleanup(): () => void {

  const settle = (behavior: ScrollBehavior) => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    if (isSectionId(id)) scrollToSection(id, behavior);
    dropHash();
  };
  const onLoad = () => settle('instant');
  const onHashChange = () => settle('auto');

  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });
  window.addEventListener('hashchange', onHashChange);

  return () => {
    window.removeEventListener('load', onLoad);
    window.removeEventListener('hashchange', onHashChange);
  };
}