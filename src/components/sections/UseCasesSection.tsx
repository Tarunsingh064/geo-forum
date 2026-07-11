import { ArrowRight } from 'lucide-react';
import { USE_CASES_VIDEO_URL } from '@/lib/constants';

export function UseCasesSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="md:pr-12 md:pt-2">
          <p className="text-black/60 text-sm mb-2">Geo Forum in Practice</p>
          <h2
            className="text-5xl md:text-6xl font-medium leading-none mb-6"
            style={{ letterSpacing: '-0.04em' }}
          >
            Who it&apos;s for
          </h2>
          <p className="text-black/60 text-base leading-relaxed max-w-sm">
            Geo Forum powers focused discussion for students, researchers, journalists, and UPSC
            aspirants who want structured debate instead of scattered comment threads.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden min-h-[720px] group">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={USE_CASES_VIDEO_URL}
          />

          <div className="relative z-10 p-10 md:p-12">
            <h3
              className="text-4xl md:text-5xl font-medium leading-tight mb-5"
              style={{ letterSpacing: '-0.03em' }}
            >
              Newsrooms & Research
            </h3>
            <p className="text-black/70 text-base max-w-md mb-8">
              Track how a story is being read in real time — verified journalists and regional
              experts add sourced analysis underneath the headline, not just reactions to it.
            </p>
            <a href="/signup" className="group/link inline-flex items-center gap-3 text-base font-medium">
              <span className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center group-hover:bg-white transition-colors">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
              Know more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
