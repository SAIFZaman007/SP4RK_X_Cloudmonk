import type { ReactElement } from 'react';

export type IconName =
  | 'network'
  | 'server'
  | 'shield'
  | 'pulse'
  | 'stack'
  | 'database'
  | 'mesh'
  | 'rack'
  | 'envelope'
  | 'radar'
  | 'vm'
  | 'web';

const paths: Record<IconName, ReactElement> = {
  network: (
    <>
      <circle cx="12" cy="5.5" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M12 7.5V11m0 0l-4.6 5.3M12 11l4.6 5.3" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.2" />
      <rect x="4" y="14" width="16" height="6" rx="1.2" />
      <circle cx="7.5" cy="7" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="17" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 7h5M11 17h5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2l6.8 2.7v5.6c0 4.6-3 7.6-6.8 8.8-3.8-1.2-6.8-4.2-6.8-8.8V5.9L12 3.2z" />
      <path d="M9.2 12.2l1.9 1.9 3.7-4" />
    </>
  ),
  pulse: <path d="M3 12h3.2l1.6-4.4 3 9 1.8-6.4 1.4 1.8H21" />,
  stack: (
    <>
      <path d="M12 3l8.5 4.4L12 11.8 3.5 7.4 12 3z" />
      <path d="M3.5 12l8.5 4.4 8.5-4.4" />
      <path d="M3.5 16.6L12 21l8.5-4.4" />
    </>
  ),
  database: (
    <>
      <path d="M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3z" />
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>
  ),
  mesh: (
    <>
      <circle cx="6" cy="6" r="1.8" />
      <circle cx="18" cy="6" r="1.8" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="18" cy="18" r="1.8" />
      <path d="M7.6 6h8.8M6 7.6v8.8M18 7.6v8.8M7.6 18h8.8M7.3 7.3l9.4 9.4M16.7 7.3L7.3 16.7" />
    </>
  ),
  rack: (
    <>
      <rect x="5" y="3.5" width="14" height="4" rx="1" />
      <rect x="5" y="9" width="14" height="4" rx="1" />
      <rect x="5" y="14.5" width="14" height="4" rx="1" />
      <rect x="5" y="20" width="14" height="0.01" />
      <circle cx="8" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8" cy="11" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  envelope: (
    <>
      <rect x="3.2" y="5.5" width="17.6" height="13" rx="1.4" />
      <path d="M3.6 7l8.4 6 8.4-6" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4" opacity="0.5" />
      <path d="M12 12L17 8" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  vm: <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3zM4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" />,
  web: <path d="M9 8l-4 4 4 4m6-8l4 4-4 4" />,
};

export default function Icon({
  name,
  className = 'h-5 w-5',
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
