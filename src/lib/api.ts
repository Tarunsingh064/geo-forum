const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// 401s on these routes are real auth failures (bad credentials, bad/expired refresh token,
// or just not-signed-in) - retrying them after a refresh would either loop forever or make no
// sense semantically, so they're never eligible for the silent-refresh-and-retry below.
const NO_REFRESH_RETRY_PATHS = ['/auth/login', '/auth/refresh', '/auth/register', '/auth/verify-otp'];

// Must match the backend's requireCustomHeaderOnMutations check (main.ts). A plain HTML form
// can never set a custom header, so this is what lets the backend tell "our own frontend" apart
// from a forged cross-site form submission now that cookies use SameSite=None in production
// (required for the cross-domain Vercel+Railway deployment - see auth.controller.ts).
const CSRF_HEADER = { 'X-Requested-With': 'geo-forum-frontend' };
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export class ApiRequestError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Multiple requests can 401 around the same moment (e.g. a page that fires several fetches on
// mount right as the access token expires) - dedupe so they all await one refresh, not five.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: CSRF_HEADER,
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const method = options.method || 'GET';
  const csrfHeader = MUTATING_METHODS.has(method) ? CSRF_HEADER : {};

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include', // sends/receives the httpOnly accessToken/refreshToken cookies
    headers: isFormData
      ? { ...csrfHeader, ...options.headers } // let the browser set multipart/form-data + boundary itself
      : { 'Content-Type': 'application/json', ...csrfHeader, ...options.headers },
  });

  // Access token likely expired mid-session: try one silent refresh, then replay the request.
  if (res.status === 401 && !isRetry && !NO_REFRESH_RETRY_PATHS.includes(path)) {
    const refreshed = await refreshSession();
    if (refreshed) return request<T>(path, options, true);
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiRequestError(body?.message || 'Something went wrong. Please try again.', res.status);
  }
  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'DELETE', body: data ? JSON.stringify(data) : undefined }),
};