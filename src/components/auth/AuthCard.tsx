// AuthCard.tsx
import Link from 'next/link';
import { Stardos_Stencil, Special_Elite } from 'next/font/google';
import { LogoIcon } from '@/components/icons/LogoIcon';

const stencil = Stardos_Stencil({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-stencil',
});

const typewriter = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-typewriter',
});

const BLUE = '#4A6B8A';
const INK = '#1C1C1A';
const CREAM = '#EDE9E1';
const PAPER = '#F7F4EE';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div
      className={`${stencil.variable} ${typewriter.variable} relative min-h-screen flex flex-col items-center justify-center px-6 py-16 overflow-hidden`}
      style={{ backgroundColor: CREAM }}
    >
      {/* faint cropped background word, same device as every other section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 text-center font-[family-name:var(--font-stencil)] font-bold uppercase select-none"
        style={{ color: '#2F4B6312', fontSize: 'clamp(5rem, 13vw, 9.5rem)', lineHeight: 0.85 }}
      >
        WELCOME
      </div>

      <Link href="/" className="relative z-10 flex items-center gap-3 shrink-0 mb-8">
  <LogoIcon className="w-11 h-11 text-[#1C1C1A]" />
  <span
    className="font-[family-name:var(--font-stencil)] text-2xl tracking-wide uppercase"
    style={{ color: INK, letterSpacing: '0.02em' }}
  >
    The Bait
  </span>
</Link>

      <div
        className="relative z-10 w-full max-w-md rounded-sm border"
        style={{
          backgroundColor: PAPER,
          borderColor: '#1C1C1A22',
          boxShadow: '8px 10px 0px rgba(74, 107, 138, 0.18), 0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex justify-center pt-6">
          <span
            className="font-[family-name:var(--font-typewriter)] text-white text-xs px-3 py-1.5 tracking-wide"
            style={{ backgroundColor: BLUE }}
          >
            {title.toUpperCase()}
          </span>
        </div>

        <div className="p-8 md:p-10 pt-6">
          {subtitle && (
            <p
              className="font-[family-name:var(--font-typewriter)] text-center text-sm leading-relaxed mb-8"
              style={{ color: `${INK}99` }}
            >
              {subtitle}
            </p>
          )}
          {!subtitle && <div className="mb-8" />}

          {children}
        </div>
      </div>

      {footer && (
        <div
          className="relative z-10 mt-6 font-[family-name:var(--font-typewriter)] text-sm"
          style={{ color: `${INK}99` }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}