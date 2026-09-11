import type { AnchorHTMLAttributes, ReactNode } from 'react';

export default function MaktechLink({
  className = '',
  children = 'Maktech',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) {
  return (
    <a
      href="https://www.maktechgroup.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`font-medium text-crimson-light underline-offset-4 transition-colors duration-200 hover:text-crimson hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-coal-900 ${className}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
}
