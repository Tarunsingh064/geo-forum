// AboutSection.tsx
'use client';

import { Stardos_Stencil, Special_Elite, Caveat } from 'next/font/google';

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
  weight: ['600', '700'],
  variable: '--font-script',
});

const BLUE = '#4A6B8A';
const GOLD = '#C79A45';
const GOLD_DARK = '#A87C2E';
const INK = '#1C1C1A';
const CREAM = '#EDE9E1';
const PAPER = '#F7F4EE';

// Same logo mark used in Hero — pin + gold hook, standing in for the founder photo
function BaitLogo({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.05}
      viewBox="0 0 512 512"
      aria-label="The Bait logo"
      style={{ filter: 'drop-shadow(8px 10px 0px rgba(0,0,0,0.1))' }}
    >
      <path
        d="M256 120c-66 0-120 52-120 116 0 82 120 200 120 200s120-118 120-200c0-64-54-116-120-116z"
        fill={INK}
      />
      <circle cx="256" cy="205" r="34" fill={PAPER} />
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

function LetsTalkButton() {
  return (
    <a
      href="/signup"
      className="inline-flex items-center gap-2 font-[family-name:var(--font-typewriter)] text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-200"
      style={{ backgroundColor: GOLD, color: INK, boxShadow: '3px 4px 0px rgba(28,28,26,0.9)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = GOLD_DARK;
        e.currentTarget.style.transform = 'translate(2px, 2px)';
        e.currentTarget.style.boxShadow = '1px 2px 0px rgba(28,28,26,0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = GOLD;
        e.currentTarget.style.transform = 'translate(0, 0)';
        e.currentTarget.style.boxShadow = '3px 4px 0px rgba(28,28,26,0.9)';
      }}
    >
      Let's Talk
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path d="M5 12h14M13 6l6 6-6 6" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

// Hand-drawn signature, standing in for "Ivo"'s — reads "The Bait" as a scrawl
function Signature() {
  return (
    <svg width="140" height="56" viewBox="0 0 140 56" fill="none" aria-label="signature">
      <path
        d="M6 40c4-14 10-24 16-24 5 0 6 12 10 12 5 0 10-18 15-18 4 0 4 20 9 20 6 0 12-22 18-22 4 0 3 16 8 16 6 0 14-14 22-14 5 0 4 8 9 8"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

const SOCIALS = [
  { label: 'LinkedIn', d: 'M4 4h4v16H4zM6 2a2 2 0 110 4 2 2 0 010-4zM10 9h4v2c1-1.5 2.5-2.3 4.5-2.3 3 0 5.5 2 5.5 6.3V20h-4v-4.5c0-2-1-3-2.5-3s-2.5 1-2.5 3V20h-4z' },
  { label: 'X', d: 'M4 4l16 16M20 4L4 20' },
  { label: 'Threads', d: 'M12 2a10 10 0 100 20 10 10 0 000-20zM9 9c1-2 5-2 6 0M8 15c1 2 6 2 8-1' },
  { label: 'Dribbble', d: 'M12 2a10 10 0 100 20 10 10 0 000-20zM3 10c5 1 12 0 17-3M4 18c5-5 12-6 16-3M9 3c3 5 4 12 2 18' },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className={`${stencil.variable} ${typewriter.variable} ${script.variable} relative px-6 pt-32 pb-24 overflow-hidden`}
      style={{ backgroundColor: CREAM }}
    >
      {/* faint cropped background word, sits inside the top padding, clear of whatever section precedes it */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 text-center font-[family-name:var(--font-stencil)] font-bold uppercase select-none"
        style={{ color: '#2F4B6312', fontSize: 'clamp(5rem, 13vw, 9.5rem)', lineHeight: 0.85 }}
      >
        ABOUT
      </div>

      <div
        className="relative z-10 mx-auto max-w-5xl rounded-sm border p-10 md:p-14"
        style={{
          backgroundColor: PAPER,
          borderColor: '#1C1C1A22',
          boxShadow: '8px 10px 0px rgba(74, 107, 138, 0.15), 0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — copy, same rhythm as the reference: greeting, intro line, body, signature, CTA + socials */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-[family-name:var(--font-typewriter)] text-white text-xs px-3 py-1.5 tracking-wide"
                style={{ backgroundColor: BLUE }}
              >
                ABOUT US
              </span>
            </div>

            <h1
              className="font-[family-name:var(--font-stencil)] text-black text-4xl md:text-5xl uppercase mt-4 mb-3"
              style={{ letterSpacing: '0.01em' }}
            >
              Hello 👋
            </h1>

            <p className="font-[family-name:var(--font-typewriter)] text-black text-lg mb-5">
              We're{' '}
              <span
                className="font-[family-name:var(--font-script)] normal-case font-bold text-2xl"
                style={{ color: GOLD_DARK }}
              >
                The Bait
              </span>
            </p>

            <div className="font-[family-name:var(--font-typewriter)] text-black/75 text-sm leading-relaxed space-y-4 mb-8">
              <p>
                We started this because most geopolitics discourse lives in reply threads with
                no sources and no memory — the takes are hot, the receipts are missing.
              </p>
              <p>
                So we built a room for it instead: threaded, cited, and built to hold a real
                disagreement without losing the thread. Students, researchers, journalists, and
                anyone who reads the news and wants to argue about it properly.
              </p>
              <p>
                No agency layer, no algorithm chasing outrage — just a place to bring a claim
                and back it up.
              </p>
            </div>

            <div className="mb-6">
              <Signature />
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <LetsTalkButton />

              <div>
                <p className="font-[family-name:var(--font-typewriter)] text-black/40 text-[10px] tracking-widest uppercase mb-2">
                  Let's Connect
                </p>
                <div className="flex items-center gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="text-black/50 hover:text-black transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d={s.d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — logo mark, standing in for the founder photo */}
          <div className="flex justify-center md:justify-end">
            <div
              className="w-full max-w-xs aspect-[4/5] rounded-sm border flex items-center justify-center"
              style={{ backgroundColor: CREAM, borderColor: '#1C1C1A18' }}
            >
              <BaitLogo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}