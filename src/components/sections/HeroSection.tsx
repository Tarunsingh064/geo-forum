'use client';

import { Stardos_Stencil, Special_Elite } from 'next/font/google';
import { Marquee } from './Marquee';
import { PillButton } from '@/components/ui/PillButton';
import { HERO_BRANDS, HERO_VIDEO_URL } from '@/lib/constants';

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

export function HeroSection() {
  return (
    <section className={`${stencil.variable} ${typewriter.variable} flex-1 px-6 pt-20 pb-6 flex items-end`}>
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 96px)' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src={HERO_VIDEO_URL}
        />

        <div className="relative z-10 flex flex-col items-start justify-start h-full p-12 pt-36">
          <h1
            className="font-[family-name:var(--font-stencil)] text-black text-5xl md:text-6xl leading-tight max-w-xl mb-4 uppercase"
            style={{ letterSpacing: '0.02em' }}
          >
            Where the World
            <br />
            Gets Argued
          </h1>

          <p className="font-[family-name:var(--font-typewriter)] text-black/70 text-base md:text-lg max-w-md mb-8 leading-relaxed">
            A dedicated home for geopolitics — long-form analysis, sourced news debate, and
            threaded discussion for students, researchers, journalists, and anyone who reads the
            news and wants to argue about it properly.
          </p>

          <PillButton href="/signup" size="lg" withArrow>
            Join the debate
          </PillButton>

          <div className="mt-24 w-full max-w-md overflow-hidden">
            <Marquee
              items={HERO_BRANDS}
              trackClassName="marquee-track font-[family-name:var(--font-typewriter)]"
              itemClassName="mx-7 shrink-0 text-black/60 whitespace-nowrap"
            />
          </div>
        </div>
      </div>
    </section>
  );
}