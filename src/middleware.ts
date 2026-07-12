import { NextResponse } from 'next/server';

/**
 * Why this file does almost nothing:
 *
 * This app is deployed with the frontend and backend on two unrelated domains (e.g. a Vercel
 * subdomain and a Railway subdomain) that share no parent domain. Session cookies are set by
 * the BACKEND, so they're scoped to the backend's domain - the browser will never attach them
 * to a request for a page on the FRONTEND's domain, no matter what SameSite/Secure settings are
 * used. That's not a bug to work around; it's just how cookies work. It also means server-side
 * middleware here can never reliably read the session (an earlier version tried to fetch
 * /users/me forwarding the incoming request's cookies, which worked in local dev only because
 * localhost:3000 and localhost:5000 happen to share the same cookie domain by an accident of
 * how browsers treat ports - that assumption doesn't hold once frontend and backend are on
 * genuinely different domains in production).
 *
 * So all auth gating now happens client-side instead, where it belongs: AuthGuard (wraps
 * src/app/app/layout.tsx) protects the authenticated area, and GuestGuard (wraps
 * src/app/(auth)/layout.tsx) keeps signed-in users off the auth pages. Both call the backend
 * directly via fetch() with credentials: 'include', which correctly carries the backend's own
 * cookies regardless of domain topology - that's the one place in this app that was never
 * actually broken.
 *
 * If you later put both frontend and backend behind a shared custom domain (e.g.
 * app.example.com and api.example.com), cookies could be scoped to the shared parent domain
 * (.example.com) and a real server-side middleware check would become viable again.
 */
export function middleware() {
  return NextResponse.next();
}

// Matcher intentionally left empty - middleware still runs (harmlessly) but no longer performs
// a check that can't work in this deployment topology.
export const config = {
  matcher: [],
};