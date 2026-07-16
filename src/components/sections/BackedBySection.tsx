// BackedBySection.tsx
'use client';

import { Stardos_Stencil, Special_Elite } from 'next/font/google';
import { Marquee } from './Marquee';
import { BACKER_BRANDS } from '@/lib/constants';

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
const GOLD = '#C79A45';
const INK = '#1C1C1A';

export function BackedBySection() {
  return (
    <section
      className={`${stencil.variable} ${typewriter.variable} relative px-6 py-20 overflow-hidden`}
      style={{ backgroundColor: '#EDE9E1' }}
    >
      {/* faint cropped word, same background device as Hero — kept low-contrast so it doesn't compete with the marquee */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-8 text-center font-[family-name:var(--font-stencil)] font-bold uppercase select-none"
        style={{ color: '#2F4B6312', fontSize: 'clamp(4rem, 11vw, 8rem)', lineHeight: 0.85 }}
      >
        TRUSTED
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-4xl rounded-sm border p-8 md:p-10"
        style={{
          backgroundColor: '#F7F4EE',
          borderColor: '#1C1C1A22',
          boxShadow: '6px 8px 0px rgba(74, 107, 138, 0.15), 0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
          <div>
            <span
              className="font-[family-name:var(--font-typewriter)] text-white text-xs px-3 py-1.5 tracking-wide inline-block mb-4"
              style={{ backgroundColor: BLUE }}
            >
              HOT TAKE
            </span>
            <p
              className="font-[family-name:var(--font-stencil)] text-black text-xl md:text-2xl leading-tight uppercase"
              style={{ letterSpacing: '0.01em' }}
            >
              What You Can Expect
              <br />
              From{' '}
              <span style={{ color: GOLD }}>Us</span>
            </p>
          </div>

          <div className="md:col-span-3 md:border-l md:pl-8" style={{ borderColor: '#1C1C1A1A' }}>
            <div className="overflow-hidden">
              <Marquee
                items={BACKER_BRANDS}
                trackClassName="backers-track font-[family-name:var(--font-typewriter)]"
                itemClassName="mx-10 shrink-0 text-black/60 whitespace-nowrap text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}