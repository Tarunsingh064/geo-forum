'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Client-side fallback for the "actually logged out" case.
 *
 * Middleware only hard-redirects to /signin when there's NO accessToken cookie at all. If a
 * cookie is present but expired, middleware deliberately lets the page through (see
 * middleware.ts) so the client's own silent-refresh logic (lib/api.ts) gets a chance to recover
 * the session first - that's what fixes the "bounces to /signin, but reloading fixes it" bug.
 *
 * But if the session is genuinely dead (refresh token also invalid/expired), something still
 * needs to catch that and send the user to /signin. That's this component: it waits for
 * AuthProvider's initial check (which includes the silent refresh attempt) to finish, and only
 * THEN redirects if it's still not authenticated. It never redirects while isLoading is true,
 * so it never fires on a session that just hasn't finished refreshing yet.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // While the initial check (and any silent refresh) is running, or once we know we're about
  // to redirect, show a blank loading state instead of flashing protected content.
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <Loader2 className="w-6 h-6 animate-spin text-black/30" />
      </div>
    );
  }

  return <>{children}</>;
}