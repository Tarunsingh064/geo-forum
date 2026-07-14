'use client';

import { Stardos_Stencil, Special_Elite } from 'next/font/google';
import { PillButton } from '@/components/ui/PillButton';
import { CARD_BG_IMAGE_URL } from '@/lib/constants';

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

export function InfoSection() {
  return (
    <section className={`${stencil.variable} ${typewriter.variable} bg-[#F5F5F5] px-6 py-24`}>
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <h2
              className="font-[family-name:var(--font-stencil)] text-black text-4xl md:text-5xl leading-tight mb-8 uppercase"
              style={{ letterSpacing: '0.01em' }}
            >
              Meet The Bait.
            </h2>
            <PillButton href="/signup" withArrow>
              Explore the forum
            </PillButton>
          </div>

          <p className="font-[family-name:var(--font-typewriter)] text-black/70 text-2xl md:text-3xl leading-relaxed">
            The Bait is a structured home for geopolitics — organized by region and topic instead
            of scattered across a hundred unrelated subreddits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="relative lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between overflow-hidden"
            style={{ backgroundImage: `url(${CARD_BG_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <h3
              className="font-[family-name:var(--font-stencil)] text-black text-2xl leading-snug uppercase"
              style={{ letterSpacing: '0.01em' }}
            >
              Reputation that means something
            </h3>
            <p className="font-[family-name:var(--font-typewriter)] text-black/70 text-base max-w-xs">
              Earn standing through well-received posts and comments — badges like Analyst,
              Researcher, and Verified Journalist mark the voices worth following.
            </p>
          </div>

          <div className="bg-[#2B2644] rounded-2xl p-7 min-h-80 flex flex-col justify-between">
            <h3 className="font-[family-name:var(--font-stencil)] text-white text-2xl leading-snug uppercase">
              News, plus
              <br />
              your analysis.
            </h3>
            <p className="font-[family-name:var(--font-typewriter)] text-white/60 text-base">
              Share a source link and add your own take, instead of just reposting a headline
              with no context.
            </p>
          </div>

          <div className="bg-[#2B2644] rounded-2xl p-7 min-h-80 flex flex-col justify-between">
            <h3 className="font-[family-name:var(--font-stencil)] text-white text-2xl leading-snug uppercase">
              Built for
              <br />
              long-form too
            </h3>
            <p className="font-[family-name:var(--font-typewriter)] text-white/60 text-base">
              Write evergreen, Medium-style analysis with charts, maps, and references — not just
              hot takes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}