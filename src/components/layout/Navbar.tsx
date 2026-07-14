'use client';

import Link from 'next/link';
import { Stardos_Stencil } from 'next/font/google';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';

const stencil = Stardos_Stencil({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-stencil',
});

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className={`${stencil.variable} absolute top-0 left-0 right-0 z-20 px-6 py-5`}>
      <div className="max-w-content mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
  <LogoIcon className="w-12 h-12 text-black" />
  <span className="font-[family-name:var(--font-stencil)] text-2xl tracking-wide text-black uppercase">
    The Bait
  </span>
</Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative font-[family-name:var(--font-stencil)] text-[15px] text-black/60 hover:text-black tracking-wide uppercase transition-colors duration-200 group"
            >
              {link}
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <span className="h-5 w-px bg-black/10" />

          <Link
            href={isLoading ? '#' : isAuthenticated ? '/app' : '/signin'}
            className="bg-black text-white text-[15px] font-medium px-6 py-2.5 rounded-full hover:bg-black/85 active:scale-[0.97] transition-all duration-200 tracking-tight"
          >
            {isAuthenticated ? 'Enter Forum' : 'Sign in'}
          </Link>
        </div>

        <Link
          href={isLoading ? '#' : isAuthenticated ? '/app' : '/signin'}
          className="md:hidden bg-black text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-black/85 active:scale-[0.97] transition-all duration-200"
        >
          {isAuthenticated ? 'Enter Forum' : 'Sign in'}
        </Link>
      </div>
    </nav>
  );
}