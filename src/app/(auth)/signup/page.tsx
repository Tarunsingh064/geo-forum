'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { OrDivider } from '@/components/auth/OrDivider';
import { Input } from '@/components/ui/Input';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { authApi } from '@/lib/auth-api';
import { ApiRequestError } from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!acceptedPolicy) {
      setError('Please accept the Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({ name, email, password, acceptedPrivacyPolicy: acceptedPolicy });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join a structured community for geopolitics discussion."
      footer={
        <span>
          Already have an account?{' '}
          <Link href="/signin" className="text-black font-medium hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <GoogleButton label="Sign up with Google" />
      <OrDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Full name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Rivera" />
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          minLength={8}
        />

        <label className="flex items-start gap-3 text-sm text-black/70">
          <input
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(e) => setAcceptedPolicy(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-black/20"
          />
          <span>
            I agree to the{' '}
            <Link href="/privacy-policy" className="text-black font-medium hover:underline" target="_blank">
              Privacy Policy
            </Link>
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <SubmitButton isLoading={isLoading}>Create account</SubmitButton>
      </form>
    </AuthCard>
  );
}
