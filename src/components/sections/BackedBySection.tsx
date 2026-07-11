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

export function BackedBySection() {
  return (
    <section className={`${stencil.variable} ${typewriter.variable} bg-[#F5F5F5] px-6 py-16`}>
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        <div className="font-[family-name:var(--font-stencil)] text-black/70 text-base leading-relaxed uppercase tracking-wide">
          What You Can Expect
          <br />
          From Us
        </div>

        <div className="md:col-span-3 overflow-hidden">
          <Marquee
            items={BACKER_BRANDS}
            trackClassName="backers-track font-[family-name:var(--font-typewriter)]"
            itemClassName="mx-10 shrink-0 text-black/50 whitespace-nowrap"
          />
        </div>
      </div>
    </section>
  );
}