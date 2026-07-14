'use client';

import { Great_Vibes, Dancing_Script } from 'next/font/google';

const calligraphic = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-calligraphic',
});

const cursive = Dancing_Script({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cursive',
});

const WHAT_YOULL_FIND = [
  'Breaking geopolitical news and updates',
  'In-depth analysis of international events',
  'Discussions on diplomacy, defense, and security',
  'Global economic and trade insights',
  'Regional and country-specific conversations',
  'Historical context behind current events',
  'Community-driven questions, debates, and research',
  'Maps, statistics, and educational resources',
];

const COMMUNITY_VALUES = [
  'Respect different viewpoints.',
  'Support claims with reliable sources whenever possible.',
  'Engage in civil and constructive discussions.',
  'Avoid misinformation, hate speech, and personal attacks.',
  'Focus on learning, critical thinking, and meaningful dialogue.',
];

export function AboutSection() {
  return (
    <section
      id="about"
      className={`${calligraphic.variable} ${cursive.variable} relative`}
    >
      {/* Background image layer — drop your image URL in here.
          e.g. style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
          The gradient scrim beneath keeps text readable over any photo. */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-[#1a1a1a]"
        style={{
           backgroundImage: "url('https://res.cloudinary.com/nzfozybo/image/upload/v1783792252/Descargar_textura_de_fondo_de_papel_arrugado_gratis_mrgonb.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-28">
        {/* Hero heading */}
        <div className="text-center mb-16">
          <h1
            className="font-[family-name:var(--font-calligraphic)] text-6xl md:text-7xl text-white mb-2"
            style={{ letterSpacing: '0.01em' }}
          >
            About The Bait
          </h1>
          <div className="w-24 h-px bg-white/30 mx-auto mt-6" />
        </div>

        {/* Intro */}
        <div className="font-[family-name:var(--font-cursive)] text-white/90 text-2xl leading-relaxed space-y-6 mb-16">
          <p>
            The Bait is a community built for people who want to understand the world beyond
            headlines. We bring together students, researchers, professionals, and curious minds
            to discuss geopolitics, international relations, global economics, defense,
            diplomacy, technology, and world affairs.
          </p>
          <p>
            Our goal is to create a space where informed discussions, diverse perspectives, and
            evidence-based analysis take priority over misinformation and sensationalism. Whether
            you&apos;re following breaking international events, exploring historical context, or
            debating the future of global power, The Bait provides a platform to learn, share,
            and engage.
          </p>
          <p>
            We encourage respectful conversations and thoughtful debate. Members are welcome to
            post news, analysis, research, questions, maps, data visualizations, and opinions,
            provided they contribute constructively to the discussion.
          </p>
        </div>

        {/* Our Mission */}
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-calligraphic)] text-4xl md:text-5xl text-white mb-5">
            Our Mission
          </h2>
          <p className="font-[family-name:var(--font-cursive)] text-white/90 text-2xl leading-relaxed max-w-2xl mx-auto">
            To make geopolitics more accessible by fostering an open community where people can
            exchange ideas, deepen their understanding of global affairs, and stay informed about
            events shaping the world.
          </p>
        </div>

        {/* What You'll Find */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-calligraphic)] text-4xl md:text-5xl text-white text-center mb-8">
            What You&apos;ll Find
          </h2>
          <ul className="font-[family-name:var(--font-cursive)] text-white/90 text-2xl leading-relaxed space-y-3 max-w-xl mx-auto">
            {WHAT_YOULL_FIND.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-white/40 mt-1.5 shrink-0">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Community Values */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-calligraphic)] text-4xl md:text-5xl text-white text-center mb-8">
            Our Community Values
          </h2>
          <ul className="font-[family-name:var(--font-cursive)] text-white/90 text-2xl leading-relaxed space-y-3 max-w-xl mx-auto">
            {COMMUNITY_VALUES.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-white/40 mt-1.5 shrink-0">✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Closing */}
        <div className="text-center border-t border-white/15 pt-12">
          <p className="font-[family-name:var(--font-cursive)] text-white/90 text-2xl leading-relaxed max-w-2xl mx-auto">
            The Bait is independent and community-driven. We believe understanding global affairs
            requires curiosity, critical thinking, and respectful discussion. Whether
            you&apos;re new to geopolitics or have years of experience studying international
            relations, there&apos;s a place for you here.
          </p>
        </div>
      </div>
    </section>
  );
}