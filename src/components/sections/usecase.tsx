'use client';

import { Stardos_Stencil, Special_Elite } from 'next/font/google';

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

const USE_CASES = [
  {
    title: 'Stay Updated',
    description:
      'Follow discussions on international events, diplomatic developments, conflicts, elections, economic trends, and other major geopolitical stories as they unfold.',
  },
  {
    title: 'Participate in Discussions',
    description:
      'Share your opinions, ask questions, and engage in respectful conversations with members from different backgrounds and viewpoints.',
  },
  {
    title: 'Publish Analysis',
    description:
      'Write detailed analyses, explain complex geopolitical topics, and contribute original insights backed by reliable sources and data.',
  },
  {
    title: 'Research and Learning',
    description:
      'Explore historical events, international relations, military strategy, global economics, and political systems through community-driven discussions and educational content.',
  },
  {
    title: 'Share News',
    description:
      'Post news articles from credible sources and discuss their implications with the community while providing context and multiple viewpoints.',
  },
  {
    title: 'Regional Communities',
    description:
      'Join discussions focused on specific countries, regions, or international organizations to better understand local and global developments.',
  },
  {
    title: 'Data and Visualizations',
    description: 'Share maps, charts, infographics, timelines, and statistics that help explain geopolitical events and trends.',
  },
  {
    title: 'Ask Questions',
    description:
      'Seek explanations about international conflicts, treaties, organizations, historical events, or current affairs from knowledgeable community members.',
  },
  {
    title: 'Follow Topics',
    description:
      'Discover and follow topics that interest you, including diplomacy, defense, cybersecurity, energy, trade, climate policy, international law, and emerging technologies.',
  },
  {
    title: 'Build Your Profile',
    description:
      'Create your profile, publish posts, participate in discussions, receive feedback from the community, and build a reputation through meaningful contributions.',
  },
  {
    title: 'Save and Revisit',
    description: 'Bookmark important discussions, research posts, and articles for future reference.',
  },
  {
    title: 'Community Moderation',
    description:
      'Help maintain a respectful and informative environment by reporting inappropriate content, supporting fact-based discussions, and following the community guidelines.',
  },
];

const WHO_CAN_BENEFIT = [
  'Students studying political science, international relations, history, economics, or law.',
  'Researchers and academics exploring global affairs.',
  'Journalists and analysts tracking international developments.',
  'Professionals working in government, policy, defense, or global business.',
  'Content creators, educators, and writers.',
  'Anyone interested in understanding world events through informed discussion.',
];

export function UseCasesSection() {
  return (
    <section
      id="use cases"
      className={`${stencil.variable} ${typewriter.variable} relative bg-[#FCFCFC]`}
    >
      <div className="max-w-6xl mx-auto px-6 py-28">
        {/* Header — offset left, file-tab style, not centered */}
        <div className="flex items-end justify-between border-b-4 border-black mb-16 pb-6 flex-wrap gap-4">
          <h1
            className="font-[family-name:var(--font-stencil)] text-5xl md:text-6xl text-black uppercase"
            style={{ letterSpacing: '0.08em' }}
          >
            Use Cases
          </h1>
          <span className="font-[family-name:var(--font-typewriter)] text-black/50 text-sm uppercase tracking-widest mb-2">
            File No. 002 — Geo Forum
          </span>
        </div>

        {/* Intro — left-aligned, indented like a memo opening line */}
        <p className="font-[family-name:var(--font-typewriter)] text-black/80 text-lg leading-relaxed mb-20 max-w-2xl">
          Geo Forum is designed for anyone who wants to stay informed, learn, and engage in
          meaningful discussions about global affairs. Whether you&apos;re a student, researcher,
          professional, or simply curious about the world, the platform offers a space to explore
          different perspectives and share knowledge.
        </p>

        {/* Use cases — numbered grid of case-file cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/15 mb-24 border border-black/15">
          {USE_CASES.map((useCase, i) => (
            <div key={useCase.title} className="bg-[#FCFCFC] p-8">
              <span className="font-[family-name:var(--font-stencil)] text-black/25 text-4xl block mb-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-[family-name:var(--font-stencil)] text-xl text-black mb-3 uppercase tracking-wide">
                {useCase.title}
              </h2>
              <p className="font-[family-name:var(--font-typewriter)] text-black/70 text-base leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>

        {/* Who Can Benefit — two-column split: label left, list right */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 mb-24 border-t-4 border-black pt-12">
          <h2 className="font-[family-name:var(--font-stencil)] text-3xl md:text-4xl text-black uppercase tracking-wide">
            Who Can
            <br />
            Benefit
          </h2>
          <ul className="font-[family-name:var(--font-typewriter)] text-black/80 text-lg leading-relaxed space-y-4">
            {WHO_CAN_BENEFIT.map((item, i) => (
              <li key={item} className="flex items-start gap-4 pb-4 border-b border-black/10 last:border-0">
                <span className="font-[family-name:var(--font-stencil)] text-black/40 text-sm mt-1 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Closing — stamped note in a boxed frame */}
        <div className="border-2 border-black/70 p-8 max-w-2xl">
          <p className="font-[family-name:var(--font-typewriter)] text-black/80 text-lg leading-relaxed">
            Geo Forum is built to encourage thoughtful conversations, evidence-based analysis, and
            respectful debate, helping members better understand the complex issues shaping our
            world.
          </p>
        </div>
      </div>
    </section>
  );
}