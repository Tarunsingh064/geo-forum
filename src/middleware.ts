import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const AUTH_PATHS = ['/signin', '/signup', '/forgot-password', '/reset-password'];
const VERIFY_PATH = '/verify-email';
const PROTECTED_PATHS = ['/app', '/dashboard'];

interface SessionUser {
  isEmailVerified: boolean;
}

async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  //console.log("Middleware:", request.nextUrl.pathname);
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader?.includes('accessToken')) return null;

  try {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { cookie: cookieHeader },
      // avoid caching a stale session across requests
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as SessionUser;
  } catch {
    // backend unreachable - fail open on read-only pages, the API itself remains the source of truth
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isVerifyPath = pathname.startsWith(VERIFY_PATH);
  const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  const user = await getSessionUser(request);

  // Logged in + verified: keep them out of every auth page (including the OTP screen)
  if (user && (isAuthPath || isVerifyPath)) {
    if (user.isEmailVerified) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
    // Logged in but not verified yet: only the verify-email screen is reachable
    if (!isVerifyPath) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
  }

  // Logged in but unverified, trying to reach a protected page: send them to verify first
  if (user && !user.isEmailVerified && isProtectedPath) {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  // Not logged in, trying to reach a protected page: send them to sign in
  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/app/:path*', '/dashboard/:path*'],
};
