'use client';

import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { reportsApi } from '@/lib/reports-api';
import { REPORT_REASON_LABELS } from '@/lib/types';
import type { ReportReason } from '@/lib/types';
import { ApiRequestError } from '@/lib/api';

interface ReportDialogProps {
  targetId: string;
  targetType: 'post' | 'comment';
}

export function ReportDialog({ targetId, targetType }: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('misleading');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit() {
    setStatus('submitting');
    try {
      await reportsApi.create(targetId, targetType, reason, details || undefined);
      setStatus('done');
    } catch (err) {
      setErrorMessage(err instanceof ApiRequestError ? err.message : 'Could not submit the report.');
      setStatus('error');
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors duration-200"
      >
        <Flag className="w-4 h-4" /> Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Report this {targetType}</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close">
                <X className="w-5 h-5 text-black/50" />
              </button>
            </div>

            {status === 'done' ? (
              <p className="text-sm text-black/70">
                Thanks — our moderation team will review this shortly.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black/70">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as ReportReason)}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                  >
                    {Object.entries(REPORT_REASON_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <Textarea
                  label="Additional details (optional)"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  maxLength={500}
                />

                {status === 'error' && <p className="text-sm text-red-600">{errorMessage}</p>}

                <Button variant="primary" onClick={handleSubmit} disabled={status === 'submitting'}>
                  Submit report
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
