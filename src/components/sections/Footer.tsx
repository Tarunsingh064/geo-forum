// Footer.tsx
'use client';

import Link from 'next/link';
import { Special_Elite } from 'next/font/google';

const typewriter = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-typewriter',
});

const CREAM = '#EDE9E1';
const INK = '#1C1C1A';

export function Footer() {
  return (
    <footer
      className={`${typewriter.variable} w-full px-6 py-6 border-t`}
      style={{ backgroundColor: CREAM, borderColor: '#1C1C1A18' }}
    >
      <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <Link
          href="/"
          className="font-[family-name:var(--font-typewriter)] text-sm transition-colors"
          style={{ color: `${INK}99` }}
        >
          Home
        </Link>
        <Link
          href="/#about"
          className="font-[family-name:var(--font-typewriter)] text-sm transition-colors"
          style={{ color: `${INK}99` }}
        >
          About
        </Link>
        <Link
          href="/signin"
          className="font-[family-name:var(--font-typewriter)] text-sm transition-colors"
          style={{ color: `${INK}99` }}
        >
          Sign in
        </Link>
        <Link
          href="/privacy-policy"
          className="font-[family-name:var(--font-typewriter)] text-sm transition-colors"
          style={{ color: `${INK}99` }}
        >
          Privacy Policy
        </Link>
        <a
          href="mailto:contact@thebait.space"
          className="font-[family-name:var(--font-typewriter)] text-sm transition-colors"
          style={{ color: `${INK}99` }}
        >
          contact@thebait.space
        </a>
      </nav>
    </footer>
  );
}