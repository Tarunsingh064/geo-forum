interface LogoIconProps {
  className?: string;
}

/** Globe mark: latitude/longitude lines over a circle, reads as "world discourse" at a glyph size. */
export function LogoIcon({ className = 'w-7 h-7' }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.2" />
      <ellipse cx="12" cy="12" rx="4" ry="9.2" />
      <path d="M2.8 12h18.4" />
      <path d="M4.2 7.2c2 1 4.9 1.6 7.8 1.6s5.8-.6 7.8-1.6" />
      <path d="M4.2 16.8c2-1 4.9-1.6 7.8-1.6s5.8.6 7.8 1.6" />
    </svg>
  );
}
