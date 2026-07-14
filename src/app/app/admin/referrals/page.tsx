'use client';

import { useEffect, useState } from 'react';
import { Copy, Loader2, Check } from 'lucide-react';
import { AdminNav } from '@/components/app/AdminNav';
import { BackButton } from '@/components/ui/Backbutton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { referralApi } from '@/lib/referral-api';
import { ApiRequestError } from '@/lib/api';
import type { ReferralCode } from '@/lib/types';

function CopyableCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-mono text-sm bg-black/5 rounded-lg px-2.5 py-1 hover:bg-black/10 transition-colors duration-200"
    >
      {value}
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-black/40" />}
    </button>
  );
}

export default function AdminReferralsPage() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<'author' | 'journalist'>('author');
  const [note, setNote] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  function loadCodes() {
    setIsLoading(true);
    referralApi
      .listAll()
      .then(setCodes)
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadCodes();
  }, []);

  async function handleGenerate() {
    setError('');
    setIsGenerating(true);
    try {
      const created = await referralApi.create({
        role,
        note: note.trim() || undefined,
        expiresInDays: expiresInDays ? Number(expiresInDays) : undefined,
      });
      setCodes((prev) => [created, ...prev]);
      setNote('');
      setExpiresInDays('');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not generate a code.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRevoke(id: string) {
    const updated = await referralApi.revoke(id);
    setCodes((prev) => prev.map((c) => (c._id === id ? updated : c)));
  }

  function statusFor(code: ReferralCode): { label: string; tone: 'neutral' | 'plum' | 'outline' } {
    if (code.usedBy) return { label: 'Redeemed', tone: 'plum' };
    if (code.isRevoked) return { label: 'Revoked', tone: 'outline' };
    if (code.expiresAt && new Date(code.expiresAt) < new Date()) return { label: 'Expired', tone: 'outline' };
    return { label: 'Active', tone: 'neutral' };
  }

  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-medium mb-2" style={{ letterSpacing: '-0.02em' }}>
        Admin panel
      </h1>
      <p className="text-black/50 text-sm mb-6">
        Generate onboarding codes that grant Author or Journalist status at signup.
      </p>
      <AdminNav />

      <div className="bg-white rounded-2xl border border-black/10 p-6 mb-6">
        <h2 className="text-base font-medium mb-4">Generate a new code</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-black/70">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'author' | 'journalist')}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
            >
              <option value="author">Author</option>
              <option value="journalist">Journalist</option>
            </select>
          </div>
          <Input label="Note (internal)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="For Jane Doe, Reuters" />
          <Input
            label="Expires in (days)"
            type="number"
            min={1}
            max={365}
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            placeholder="Never"
          />
          <Button variant="primary" onClick={handleGenerate} disabled={isGenerating} className="justify-center">
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate code
          </Button>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : codes.length === 0 ? (
        <p className="text-black/50 text-center py-12">No referral codes yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/10 divide-y divide-black/5">
          {codes.map((code) => {
            const status = statusFor(code);
            const usedByName = typeof code.usedBy === 'string' ? code.usedBy : code.usedBy?.name;
            return (
              <div key={code._id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <CopyableCode value={code.code} />
                  <Badge tone="outline">{code.role}</Badge>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  {usedByName && <span className="text-sm text-black/50">redeemed by {usedByName}</span>}
                  {code.note && <span className="text-sm text-black/40">— {code.note}</span>}
                </div>
                {!code.usedBy && !code.isRevoked && (
                  <Button variant="danger" size="sm" onClick={() => handleRevoke(code._id)}>
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}