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
 * Shows a loader while the auth check is in flight, and while a redirect is pending, so a
 * signed-in user never sees a flash of the sign-in form before being sent to /app.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const needsRedirect =
    isAuthenticated && (user?.isEmailVerified ? true : pathname !== '/verify-email');

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (user?.isEmailVerified) {
      router.replace('/app');
    } else if (pathname !== '/verify-email') {
      router.replace('/verify-email');
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading || needsRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}