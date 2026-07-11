import { LogoIcon } from '@/components/icons/LogoIcon';

interface PolicyResponse {
  version: number;
  content: string;
}

async function getPolicy(): Promise<PolicyResponse | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${API_URL}/privacy-policy/active`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const policy = await getPolicy();

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-10">
          <LogoIcon className="w-7 h-7 text-black" />
          <span className="text-2xl font-medium tracking-tight text-black">Geo Forum</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-medium mb-6" style={{ letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>

        {policy ? (
          <>
            <p className="text-black/50 text-sm mb-6">Version {policy.version}</p>
            <div className="whitespace-pre-wrap text-black/70 text-base leading-relaxed">
              {policy.content}
            </div>
          </>
        ) : (
          <p className="text-black/60">
            We couldn&apos;t load the policy right now. Please try again shortly.
          </p>
        )}
      </div>
    </div>
  );
}
