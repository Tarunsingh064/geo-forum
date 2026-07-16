// HeroSection.tsx
'use client';

import { Stardos_Stencil, Special_Elite, Caveat } from 'next/font/google';
import { Marquee } from './Marquee';
import { HERO_BRANDS } from '@/lib/constants';

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

const script = Caveat({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-script',
});

const TICKET_ROWS = [
  { label: 'TOPIC', value: 'Geopolitics, sourced & argued' },
  { label: 'FORMAT', value: 'Long-form debate threads' },
  { label: 'AUDIENCE', value: 'Students · Researchers · Journalists' },
];

const NAVBAR_HEIGHT = 96;
const GOLD = '#C79A45';
const GOLD_DARK = '#A87C2E';
const BLUE = '#4A6B8A';
const INK = '#1C1C1A';

// Logo mark — pin + hook, matching the favicon
function BaitLogo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.05}
      viewBox="0 0 512 512"
      aria-label="Bait logo"
      style={{ filter: 'drop-shadow(3px 4px 0px rgba(0,0,0,0.12))' }}
    >
      <path
        d="M256 120c-66 0-120 52-120 116 0 82 120 200 120 200s120-118 120-200c0-64-54-116-120-116z"
        fill={INK}
      />
      <circle cx="256" cy="205" r="34" fill="#F4F2EE" />
      <path
        d="M256 330c0 0 0 40 0 60 0 26 20 42 42 42 24 0 44-18 44-42 0-16-14-26-26-20"
        fill="none"
        stroke={GOLD}
        strokeWidth="16"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Custom CTA — replaces the generic PillButton, styled around the logo's gold hook
function JoinDebateButton() {
  return (
    <a
      href="/signup"
      className="group inline-flex items-center gap-2 font-[family-name:var(--font-typewriter)] text-sm tracking-wide px-7 py-3.5 rounded-full transition-all duration-200"
      style={{
        backgroundColor: GOLD,
        color: INK,
        boxShadow: '4px 5px 0px rgba(28,28,26,0.9)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = GOLD_DARK;
        e.currentTarget.style.transform = 'translate(2px, 2px)';
        e.currentTarget.style.boxShadow = '2px 3px 0px rgba(28,28,26,0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = GOLD;
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = '4px 5px 0px rgba(28,28,26,0.9)';
      }}
    >
      RSVP — JOIN THE DEBATE
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M6 18c0 0 0-6 0-9 0-4 3-6 6-6s6 2 6 6c0 3-3 4-4-1"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </a>
  );
}

export function HeroSection() {
  return (
    <section
      className={`${stencil.variable} ${typewriter.variable} ${script.variable} relative flex-1 px-6 pb-6 overflow-hidden flex flex-col justify-center`}
      style={{
        backgroundColor: '#EDE9E1',
        paddingTop: NAVBAR_HEIGHT,
        minHeight: `calc(100vh)`,
      }}
    >
      {/* THE — top, center-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute font-[family-name:var(--font-stencil)] font-bold uppercase select-none"
        style={{
          top: NAVBAR_HEIGHT + 8,
          left: '8%',
          color: BLUE,
          fontSize: 'clamp(6rem, 18vw, 13rem)',
          lineHeight: 0.85,
          letterSpacing: '0.01em',
          textShadow: '6px 6px 0px rgba(0,0,0,0.08)',
        }}
      >
        THE
      </div>

      {/* BAIT — bottom, center-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute font-[family-name:var(--font-stencil)] font-bold uppercase select-none"
        style={{
          bottom: '2%',
          right: '6%',
          color: BLUE,
          fontSize: 'clamp(6rem, 18vw, 13rem)',
          lineHeight: 0.85,
          letterSpacing: '0.01em',
          textShadow: '6px 6px 0px rgba(0,0,0,0.08)',
        }}
      >
        BAIT
      </div>

      {/* Floating ticket card — tilted, with logo mark in the header */}
      <div
        className="relative z-10 mx-auto w-full max-w-xl rounded-sm border p-10 pt-8"
        style={{
          backgroundColor: '#F7F4EE',
          borderColor: '#1C1C1A22',
          transform: 'rotate(-2.5deg)',
          boxShadow: `10px 14px 0px rgba(199, 154, 69, 0.25), 0 4px 12px rgba(0,0,0,0.12)`,
        }}
      >
        <div className="flex justify-center mb-5">
          <BaitLogo />
        </div>

        <p className="font-[family-name:var(--font-typewriter)] text-center text-sm tracking-wide text-black/70 mb-1">
          HELLO, READER! YOU ARE INVITED TO
        </p>
        <h1 className="font-[family-name:var(--font-typewriter)] text-center text-sm tracking-wide text-black/70 mb-6">
          THE ARGUMENT
        </h1>

        <h2
          className="font-[family-name:var(--font-stencil)] text-black text-4xl md:text-5xl leading-tight text-center uppercase mb-2"
          style={{ letterSpacing: '0.02em' }}
        >
          No Friends. No Enemies.
          <br />
          Only{' '}
          <span
            className="font-[family-name:var(--font-script)] normal-case font-semibold"
            style={{ color: GOLD_DARK }}
          >
            Interests.
          </span>
        </h2>

        <div className="w-full mt-8 mb-2">
          {TICKET_ROWS.map((row, i) => (
            <div key={row.label} className={i > 0 ? 'mt-6' : ''}>
              <div className="flex items-center gap-3">
                <span
                  className="font-[family-name:var(--font-typewriter)] text-white text-xs px-3 py-1.5 tracking-wide shrink-0"
                  style={{ backgroundColor: BLUE }}
                >
                  {row.label}
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#1C1C1A2E' }} />
              </div>
              <p className="font-[family-name:var(--font-typewriter)] text-black text-xl md:text-2xl mt-3 leading-snug">
                {row.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <JoinDebateButton />
        </div>

        <div className="mt-8 w-full overflow-hidden border-t pt-6" style={{ borderColor: '#1C1C1A22' }}>
          <Marquee
            items={HERO_BRANDS}
            trackClassName="marquee-track font-[family-name:var(--font-typewriter)]"
            itemClassName="mx-7 shrink-0 text-black/60 whitespace-nowrap text-sm"
          />
        </div>
      </div>
    </section>
  );
}