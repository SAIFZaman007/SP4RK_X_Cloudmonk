import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared CTA styles. Both are "empty" (transparent fill) with an aesthetic
 * gold border, per design direction: no red/crimson fills on buttons.
 * Kept in one place so every CTA across the site (Navbar, Hero, Contact)
 * stays visually identical and only needs to change here.
 */
export const ctaGold =
  'border border-gold/50 text-gold-light bg-transparent backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_32px_-10px_rgba(212,175,55,0.55)]';

export const ctaGoldPill = cn(
  'inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium',
  ctaGold
);

export const ctaGoldPillSm = cn(
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[13px]',
  ctaGold
);
