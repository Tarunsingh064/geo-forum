'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

/**
 * Client-side gate for the (auth) route group: signin, signup, forgot-password,
 * reset-password, and verify-email.
 *
 * This used to be middleware's job, but middleware can't see the session at all once frontend
 * and backend are on separate domains (see middleware.ts). So this component now decides:
 *
 *  - not signed in -> render the auth page normally (the common case: an anonymous visitor)
 *  - signed in + verified -> redirect to /app (an already-logged-in user has no business on
 *    /signin, /signup, etc.)
 *  - signed in + NOT verified -> redirect to /verify-email specifically, UNLESS they're already
 *    there, since that's the one auth page they're still allowed to use.
 *
 * Deliberately renders children immediately rather than blocking on isLoading, since these are
 * public pages - an anonymous visitor shouldn't see a loading spinner before a sign-in form.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (user?.isEmailVerified) {
      router.replace('/app');
    } else if (pathname !== '/verify-email') {
      router.replace('/verify-email');
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  return <>{children}</>;
}