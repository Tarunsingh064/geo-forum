# Geo Forum — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS. What was originally a stablecoin marketing
template has been rebranded and rebuilt to actually match the product underneath: a structured
geopolitics discussion forum. Includes the full auth flow (sign up, OTP email verification,
Google OAuth, sign in, forgot/reset password, silent token refresh) and the real product area —
feed, posts, threaded comments, voting, profiles, settings, notifications (in-app + browser push),
bookmarks, search, a paid "Verified" membership via Razorpay, and an admin panel — all wired to
the NestJS backend built earlier.

Verified with a real `next build` — compiles clean, all 23 routes prerender correctly.

## Getting started

```bash
cp .env.example .env.local     # point NEXT_PUBLIC_API_URL at your running backend,
                                 # and paste your VAPID public key for push notifications
npm install
npm run dev                     # http://localhost:3000
```

Drop the two font files referenced in `globals.css` into `public/fonts/`:
`tt-norms-pro-regular.woff2` (400) and `tt-norms-pro-semibold.woff2` (600).

For push notifications to work, the backend's Google OAuth callback URL and this app's
`NEXT_PUBLIC_API_URL` need to agree, and the backend's `VAPID_PUBLIC_KEY` must match
`NEXT_PUBLIC_VAPID_PUBLIC_KEY` here (they're the same keypair, generated once on the backend).

## Newly wired since the last pass

- **Google OAuth** — `GoogleButton` on `/signin` and `/signup` links straight to
  `${API_URL}/auth/google` (a real page navigation, not a fetch, since it's a server-driven
  redirect to Google and back). `/auth/callback/success` is where the backend lands the browser
  afterward; it syncs the client auth state and continues into `/app`.
- **Silent token refresh** — `lib/api.ts` now catches a 401, calls `POST /auth/refresh` once,
  and replays the original request. Concurrent 401s are deduped onto a single refresh call so a
  page that fires several requests at once doesn't trigger five refreshes.
- **Membership / Verified badge** — `/app/membership` loads the Razorpay checkout script,
  creates an order via `POST /subscription/create-order`, opens Razorpay's modal, and on success
  calls `POST /subscription/verify`. Linked from the account menu.
- **Browser push notifications** — `/app/notifications` has an Enable/Disable control that
  registers `public/sw.js`, requests permission, subscribes via the Push API, and sends the
  subscription to `POST /notifications/push-subscribe`. `usePushNotifications` hook holds all of
  this so it can be dropped anywhere else later (e.g. a settings toggle) without re-deriving it.

## Structure

```
middleware.ts                     # route protection (see below)
src/
  app/
    layout.tsx                    # root layout, wraps AuthProvider
    page.tsx                      # landing page composition
    globals.css                   # Tailwind layers, @font-face, marquee keyframes
    (auth)/
      signin/page.tsx
      signup/page.tsx
      verify-email/page.tsx       # OTP entry, resend w/ 60s cooldown
      forgot-password/page.tsx
      reset-password/page.tsx
    dashboard/page.tsx             # legacy URL, redirects to /app
    privacy-policy/page.tsx        # renders the backend's active policy version
    app/                           # ← the real product, behind auth
      layout.tsx                   # AppNavbar + content container
      page.tsx                     # feed (latest/trending, category filter)
      post/[id]/page.tsx           # post detail, threaded comments, voting, report, bookmark
      create/page.tsx              # discussion / news+analysis / article composer
      profile/[id]/page.tsx        # public profile, follow button, published posts
      settings/page.tsx            # profile edit, avatar, password, activity, deactivate/delete
      notifications/page.tsx
      bookmarks/page.tsx
      search/page.tsx
      admin/                       # admin-role only (also gated server-side by the API)
        page.tsx                   # overview + revenue stats
        users/page.tsx             # role, ban, verify-journalist
        reports/page.tsx           # moderation queue
        posts/page.tsx             # all-posts oversight
  components/
    icons/LogoIcon.tsx
    layout/Navbar.tsx               # marketing navbar: auth-aware "Sign in" vs "Open Wallet"
    sections/                      # Hero, Info, BackedBy, UseCases, Marquee (landing page)
    auth/AuthCard.tsx, OtpInput.tsx
    app/                           # product-area components
      AppNavbar.tsx, AdminNav.tsx
      PostCard.tsx, VoteButtons.tsx
      CommentThread.tsx, CommentForm.tsx
      CategoryFilterBar.tsx, ReportDialog.tsx
    ui/                            # PillButton (marketing CTAs) + Button/Input/Textarea/Avatar/Badge (product UI)
  lib/
    api.ts                         # fetch wrapper (credentials: 'include', typed errors, FormData support)
    auth-api.ts, posts-api.ts, comments-api.ts, votes-api.ts, follow-api.ts,
    bookmark-api.ts, notification-api.ts, users-api.ts, admin-api.ts,
    reports-api.ts, search-api.ts   # one typed module per backend resource
    auth-context.tsx                # client-side session state (user, isAuthenticated, login/logout)
    constants.ts, types.ts          # types mirror the backend's Mongoose enums exactly
  hooks/useAuth.ts                  # ergonomic wrapper around the auth context
```

## What's in the product area (`/app`)

- **Feed** — latest/trending sort, category filter chips, right-rail CTA to post.
- **Post detail** — full content, source link (for News posts), images, vote buttons, save/bookmark,
  report dialog, and a fully threaded comment section (reply-to-reply, inline reply forms).
- **Create post** — discussion / news+analysis / article, up to 5 categories, tags, draft or publish.
- **Profile** — bio, badges, reputation, follow/unfollow, that person's published posts.
- **Settings** — tabbed: Profile (name/bio/gender/expertise tags + avatar upload), Security
  (change password), Activity (my posts / my comments / my liked posts), Account (deactivate or
  permanently delete, both re-confirm your password first).
- **Notifications** — list, mark one or all as read.
- **Bookmarks** — saved posts.
- **Search** — people, discussions/news, and articles in one query.
- **Admin panel** (only linked from the account menu when `role === 'admin'`; the API itself is
  the real gate) — overview stats + revenue, user management (ban, role, grant "Verified
  Journalist"), the report moderation queue, and all-posts oversight.

One known gap: the backend doesn't expose "what did *I* vote on this specific post" for feed/list
views, so `VoteButtons` starts from a neutral state and updates optimistically per click rather
than showing your prior vote when a page loads. Fine for a v1; would need a small backend
endpoint (batch vote lookup) to close.

## Auth flow & route protection

The backend issues JWTs as httpOnly cookies (`accessToken` / `refreshToken`), so the frontend
never touches tokens directly — every API call goes through `lib/api.ts` with
`credentials: 'include'`.

**`middleware.ts`** runs on every request to the auth pages and the whole `/app/*` tree and calls
`GET /users/me` server-side (forwarding the request's cookies) to check the session **before**
the page renders:

- **No session** + protected route (`/app/*`) → redirect to `/signin`.
- **Session + verified email** + any auth page (`/signin`, `/signup`, `/verify-email`,
  `/forgot-password`, `/reset-password`) → redirect to `/app`. This is the
  "logged-in users can't reach auth pages" requirement.
- **Session but unverified email** + protected route → redirect to `/verify-email` (only that
  one auth page stays reachable so they can finish verifying).

**`lib/auth-context.tsx`** is the client-side mirror of this state (fetches `/users/me` on
mount) — used for in-page UI decisions like the Navbar's "Sign in" vs "Open Wallet" label,
the account-menu admin link, and the vote/report/bookmark buttons bouncing an anonymous visitor
to `/signin` instead of silently failing.

**Signup → verify → login loop:**
1. `POST /auth/register` creates the account (unverified) and the backend emails an OTP.
2. Frontend redirects to `/verify-email?email=...`.
3. `POST /auth/verify-otp` succeeds → backend sets the session cookies → redirect to `/app`.
4. If an already-registered-but-unverified user tries `/signin` instead, the backend's "please
   verify your email" error is caught and they're bounced to `/verify-email` automatically
   rather than shown a dead-end error.

## Design notes

The landing page follows the supplied spec exactly (colors, copy, layout, exact marquee brand
typography) since it was already a fully-specified brief. The auth pages and the product area
extend the same visual language — `#F5F5F5` page background, black pill/rounded buttons, the
Halo mark, `-0.02em` to `-0.04em` tracking on headings — rather than introducing a second design
system, so moving from the marketing site into the product feels like one continuous brand.
