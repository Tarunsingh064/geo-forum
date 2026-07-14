'use client';

import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Clock, XCircle } from 'lucide-react';
import { BackButton } from '@/components/ui/Backbutton';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { applicationsApi } from '@/lib/applications-api';
import { useAuth } from '@/hooks/useAuth';
import { ApiRequestError } from '@/lib/api';
import type { ContributorApplication } from '@/lib/types';

export default function ApplyPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ContributorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestedRole, setRequestedRole] = useState<'author' | 'journalist'>('author');
  const [motivation, setMotivation] = useState('');
  const [portfolioLinksInput, setPortfolioLinksInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    applicationsApi
      .getMine()
      .then(setApplications)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (motivation.trim().length < 50) {
      setError("Tell us a bit more about why you'd be a good fit - at least 50 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      const portfolioLinks = portfolioLinksInput
        .split(/[\n,]/)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 5);
      const application = await applicationsApi.apply({ requestedRole, motivation: motivation.trim(), portfolioLinks });
      setApplications((prev) => [application, ...prev]);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not submit your application.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const latest = applications[0];
  const isPaidMember = user?.subscriptionTier === 'verified';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-black/40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Apply for Author or Journalist status
      </h1>
      <p className="text-black/60 text-sm mb-6">
        Author and Journalist badges unlock debate hosting, paywalled articles, and tipping.
        Applications from Verified members are prioritized, but everyone is welcome to apply.
      </p>

      {user?.contributorType && user.contributorType !== 'none' ? (
        <div className="bg-white rounded-2xl border border-black/10 p-6 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#2B2644] shrink-0" />
          <div>
            <p className="font-medium mb-1 capitalize">You&apos;re already a {user.contributorType}</p>
            <p className="text-sm text-black/60">No need to apply again — check your contributor dashboard for what&apos;s next.</p>
          </div>
        </div>
      ) : latest?.status === 'pending' ? (
        <div className="bg-white rounded-2xl border border-black/10 p-6 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium capitalize">Application under review</p>
              <Badge tone="outline">{latest.requestedRole}</Badge>
            </div>
            <p className="text-sm text-black/60">
              Submitted {new Date(latest.createdAt).toLocaleDateString()}. We&apos;ll email you once it&apos;s reviewed.
            </p>
          </div>
        </div>
      ) : submitted ? (
        <div className="bg-white rounded-2xl border border-black/10 p-6 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <p className="font-medium mb-1">Application submitted</p>
            <p className="text-sm text-black/60">We&apos;ll email you once it&apos;s reviewed.</p>
          </div>
        </div>
      ) : (
        <>
          {latest?.status === 'rejected' && (
            <div className="bg-white rounded-2xl border border-red-200 p-5 mb-6 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm mb-1">Your last application wasn&apos;t approved</p>
                {latest.reviewNotes && <p className="text-sm text-black/60 mb-1">&ldquo;{latest.reviewNotes}&rdquo;</p>}
                <p className="text-xs text-black/40">You can submit a new application below if it&apos;s been 30 days.</p>
              </div>
            </div>
          )}

          {!isPaidMember && (
            <div className="rounded-xl bg-black/5 p-4 mb-6 text-sm text-black/60">
              Verified members&apos; applications are reviewed first. Consider{' '}
              <a href="/app/membership" className="text-black font-medium hover:underline">
                upgrading to Verified
              </a>{' '}
              to speed up your review — free applications are still reviewed regularly, just less frequently.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black/70">I&apos;m applying as</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value as 'author' | 'journalist')}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
              >
                <option value="author">Author — long-form analysis</option>
                <option value="journalist">Journalist — credentialed press</option>
              </select>
            </div>

            <Textarea
              label="Why should we approve you?"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={5}
              placeholder="Your background, expertise, and what you plan to contribute…"
            />

            <Input
              label="Portfolio links (optional, comma or newline separated)"
              value={portfolioLinksInput}
              onChange={(e) => setPortfolioLinksInput(e.target.value)}
              placeholder="https://..."
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="primary" disabled={isSubmitting} className="self-end">
              Submit application
            </Button>
          </form>
        </>
      )}
    </div>
  );
}