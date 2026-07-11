'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { OrDivider } from '@/components/auth/OrDivider';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { ApiRequestError } from '@/lib/api';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/app');
    } catch (err) {
      if (err instanceof ApiRequestError && err.message.toLowerCase().includes('verify')) {
        // backend refuses login until the email is verified - send them straight to the OTP step
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to jump back into the discussion."
      footer={
        <span>
          New here?{' '}
          <Link href="/signup" className="text-black font-medium hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <GoogleButton />
      <OrDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <div className="flex flex-col gap-1.5">
          <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <Link href="/forgot-password" className="self-end text-sm text-black/60 hover:text-black transition-colors duration-200">
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
      </form>
    </AuthCard>
  );
}
