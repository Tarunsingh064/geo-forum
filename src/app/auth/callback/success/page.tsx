'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function GoogleCallbackSuccessPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  useEffect(() => {
    // The backend has already set the session cookies by the time it redirects here -
    // just sync the client-side auth state and continue in.
    refresh().then(() => router.replace('/app'));
  }, [refresh, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F5F5F5] text-black/50">
      <Loader2 className="w-6 h-6 animate-spin" />
      <p className="text-sm">Signing you in…</p>
    </div>
  );
}
