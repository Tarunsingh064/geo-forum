'use client';

import { useAuthContext } from '@/lib/auth-context';

/**
 * Read and act on the current session anywhere in the client tree.
 * Route-level protection (redirects for logged-out/unverified users)
 * lives in middleware.ts - this hook is for in-page UI decisions
 * (e.g. showing the right nav state, guarding a button).
 */
export function useAuth() {
  return useAuthContext();
}
