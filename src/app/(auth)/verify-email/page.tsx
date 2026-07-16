'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { OtpInput } from '@/components/auth/OtpInput';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { authApi } from '@/lib/auth-api';
import { ApiRequestError } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  // Synchronous guard against double-submission (auto-submit-on-complete firing
  // alongside a form submit, double Enter, double click, etc). React state
  // (isLoading) updates asynchronously and can't reliably block a second call
  // that happens in the same tick - a ref can, since it's checked and set
  // synchronously before anything async happens.
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = useCallback(
    async (otp: string) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      setError('');
      setIsLoading(true);
      try {
        await authApi.verifyOtp(email, otp);
        await refresh();
        router.push('/app');
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : 'Verification failed.');
      } finally {
        setIsLoading(false);
        isSubmittingRef.current = false;
      }
    },
    [email, refresh, router],
  );

  async function handleResend() {
    setError('');
    setMessage('');
    setCode(''); // a resend invalidates whatever was already typed - don't let a stale code get submitted
    try {
      await authApi.resendOtp(email);
      setMessage('A new code is on its way to your inbox.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not resend the code.');
    }
  }

  return (
    <AuthCard
      title="Check your inbox"
      subtitle={email ? `Enter the 6-digit code we sent to ${email}` : 'Enter the 6-digit code we emailed you'}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify(code);
        }}
        className="flex flex-col gap-6"
      >
        <OtpInput value={code} onChange={setCode} />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && !error && <p className="text-sm text-black/60">{message}</p>}

        <SubmitButton isLoading={isLoading} disabled={code.length !== 6}>
          Verify email
        </SubmitButton>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-sm text-black/60 hover:text-black transition-colors duration-200 disabled:opacity-40"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </form>
    </AuthCard>
  );
}

// useSearchParams requires a Suspense boundary in the App Router
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}