'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/admin-api';
import { BackButton } from '@/components/ui/Backbutton';

export default function AdminPrivacyPolicyPage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    adminApi
      .privacyPolicy()
      .then((res) => {
        if (isMounted) {
          setContent(res.content || '');
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFeedback({
            type: 'error',
            message: err instanceof Error ? err.message : 'Failed to load the privacy policy.',
          });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await adminApi.privacyPolicypost(content);
      setFeedback({ type: 'success', message: 'Privacy policy updated successfully.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save the privacy policy.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
       <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">Manage the privacy policy shown to users.</p>
      <AdminNav />

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-black/10 p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium">Privacy policy content</h2>
            <p className="text-sm text-black/50">
              This content is displayed on the public privacy policy page.
            </p>
          </div>
          <Button type="submit" variant="primary" disabled={isLoading || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save policy'
            )}
          </Button>
        </div>

        {feedback ? (
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{feedback.message}</span>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-black/10 bg-black/[0.02]">
            <Loader2 className="w-6 h-6 animate-spin text-black/40" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-[360px] w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-7 text-black/80 outline-none focus:border-black"
            placeholder="Write the privacy policy content here..."
          />
        )}
      </form>
    </div>
  );
}
