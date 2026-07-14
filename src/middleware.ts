import { NextRequest, NextResponse } from 'next/server';

// Server-only var (no NEXT_PUBLIC_ prefix needed since this runs on the server/edge).
// Make sure API_URL is set in your Vercel production environment to https://api.thebait.space/api/v1
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const AUTH_PATHS = ['/signin', '/signup', '/forgot-password', '/reset-password'];
const VERIFY_PATH = '/verify-email';
const PROTECTED_PATHS = ['/app', '/dashboard'];

interface SessionUser {
  isEmailVerified: boolean;
}

interface SessionResult {
  user: SessionUser | null;
  setCookie?: string;
}

async function fetchMe(cookieHeader: string): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as SessionUser;
  } catch {
    // backend unreachable - fail open on read-only pages, the API itself remains the source of truth
    return null;
  }
}

async function getSessionUser(request: NextRequest): Promise<SessionResult> {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return { user: null };

  // 1. Try the access token first, if present
  if (cookieHeader.includes('accessToken')) {
    const user = await fetchMe(cookieHeader);
    if (user) return { user };
  }

  // 2. Access token missing or expired - try to refresh if we have a refresh cookie
  if (cookieHeader.includes('refreshToken')) {
    try {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { cookie: cookieHeader },
        cache: 'no-store',
      });

      if (refreshRes.ok) {
        const setCookie = refreshRes.headers.get('set-cookie') ?? undefined;
        // Use the freshly issued cookies (if any) to re-check the session
        const newCookieHeader = setCookie || cookieHeader;
        const user = await fetchMe(newCookieHeader);
        return { user, setCookie };
      }
    } catch {
      // backend unreachable during refresh - treat as logged out for this request
      return { user: null };
    }
  }

  return { user: null };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isVerifyPath = pathname.startsWith(VERIFY_PATH);
  const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  const { user, setCookie } = await getSessionUser(request);

  const withRefreshedCookies = (response: NextResponse) => {
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }
    return response;
  };

  // Logged in + verified: keep them out of every auth page (including the OTP screen)
  if (user && (isAuthPath || isVerifyPath)) {
    if (user.isEmailVerified) {
      return withRefreshedCookies(NextResponse.redirect(new URL('/app', request.url)));
    }
    // Logged in but not verified yet: only the verify-email screen is reachable
    if (!isVerifyPath) {
      return withRefreshedCookies(NextResponse.redirect(new URL('/verify-email', request.url)));
    }
  }

  // Logged in but unverified, trying to reach a protected page: send them to verify first
  if (user && !user.isEmailVerified && isProtectedPath) {
    return withRefreshedCookies(NextResponse.redirect(new URL('/verify-email', request.url)));
  }

  // Not logged in, trying to reach a protected page: send them to sign in
  if (!user && isProtectedPath) {
    return withRefreshedCookies(NextResponse.redirect(new URL('/signin', request.url)));
  }

  return withRefreshedCookies(NextResponse.next());
}

export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/app/:path*',
    '/dashboard/:path*',
  ],
};