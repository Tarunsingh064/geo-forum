'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { BackButton } from '@/components/ui/Backbutton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { applicationsApi } from '@/lib/applications-api';
import type { ContributorApplication } from '@/lib/types';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ContributorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  function loadQueue() {
    setIsLoading(true);
    applicationsApi
      .getQueue()
      .then(setApplications)
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadQueue();
  }, []);

  async function handleApprove(id: string) {
    await applicationsApi.approve(id, notes.trim() || undefined);
    setApplications((prev) => prev.filter((a) => a._id !== id));
    setReviewingId(null);
    setNotes('');
  }

  async function handleReject(id: string) {
    await applicationsApi.reject(id, notes.trim() || undefined);
    setApplications((prev) => prev.filter((a) => a._id !== id));
    setReviewingId(null);
    setNotes('');
  }

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">
        Author/Journalist applications, weighted so Verified members are reviewed first (~9 in
        10) without fully starving free-tier applicants (~1 in 10).
      </p>
      <AdminNav />

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <p className="text-black/50 text-center py-12">No pending applications.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((application) => {
            const applicant = typeof application.user === 'string' ? null : application.user;
            const isReviewing = reviewingId === application._id;
            return (
              <div key={application._id} className="bg-white rounded-2xl border border-black/10 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={applicant?.name || 'Unknown'} avatarUrl={applicant?.avatarUrl} size={36} />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/app/profile/${applicant?._id}`} className="font-medium text-sm hover:underline">
                          {applicant?.name || 'Unknown'}
                        </Link>
                        <Badge tone="outline">{application.requestedRole}</Badge>
                        {application.isPaidAtApplication ? (
                          <Badge tone="plum">Verified member</Badge>
                        ) : (
                          <Badge>Free member</Badge>
                        )}
                      </div>
                      <p className="text-xs text-black/40">{new Date(application.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-black/70 mb-2 leading-relaxed">{application.motivation}</p>

                {application.portfolioLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {application.portfolioLinks.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-black/50 underline hover:text-black"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}

                {isReviewing ? (
                  <div className="flex flex-col gap-2 mt-3">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional note (visible to applicant if rejected)"
                      rows={2}
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setReviewingId(null)}>
                        Cancel
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleReject(application._id)}>
                        Reject
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleApprove(application._id)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button variant="secondary" size="sm" onClick={() => setReviewingId(application._id)}>
                      Review
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}