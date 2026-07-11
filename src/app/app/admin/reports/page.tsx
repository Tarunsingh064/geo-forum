'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { reportsApi } from '@/lib/reports-api';
import { REPORT_REASON_LABELS } from '@/lib/types';
import type { Report } from '@/lib/types';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportsApi
      .getAll('pending')
      .then(setReports)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleReview(report: Report, status: 'action_taken' | 'dismissed') {
    await reportsApi.review(report._id, status);
    setReports((prev) => prev.filter((r) => r._id !== report._id));
  }

  const reporterName = (report: Report) => (typeof report.reporter === 'string' ? report.reporter : report.reporter.name);

  return (
    <div>
       <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">Review flagged posts and comments.</p>
      <AdminNav />

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <p className="text-black/50 text-center py-16">No pending reports. Nice and quiet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 divide-y divide-black/5">
          {reports.map((report) => (
            <div key={report._id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge>{report.targetType}</Badge>
                  <Badge tone="outline">{REPORT_REASON_LABELS[report.reason]}</Badge>
                </div>
                <p className="text-sm text-black/70">
                  Reported by {reporterName(report)}
                  {report.details && <span className="text-black/50"> — &ldquo;{report.details}&rdquo;</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleReview(report, 'dismissed')}>
                  Dismiss
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleReview(report, 'action_taken')}>
                  Remove content
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
