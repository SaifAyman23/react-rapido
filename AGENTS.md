# AGENTS.md — React Rapido

Authoritative instructions for AI agents working in this repository. These rules are
mandatory unless a rule explicitly says otherwise.

Read this file before changing code. The `docs/` folder holds per-domain deep dives
(`docs/Performance.md`, `docs/SEO.md`, `docs/Accessibility.md`, `docs/BestPractices.md`)
— read the one relevant to your change and keep it accurate.

## 1. What this is

**React Rapido** is a generic Vite starter — the React sibling of
[django-rapido](https://github.com/SaifAyman23/django-rapido). It ships landing + auth
shells and a fully wired client-to-server auth stack ported from the mobile template.
It is not a product, not a portfolio, not a demo — no domain data, no user types, no
showcase sections. Your app ships your domain; this starter stays out of its way.

Non-negotiables:

1. **The API contract lives in code, not in your head.** `src/api/contracts.ts` is the
   single source of truth for wire shapes (`AuthResponse`, `AccountSummary`, error
   envelope, token refresh). If you must change it, the backend changes in the same
   slice — no client-only contract edits.
2. **Every request goes through `src/api/axiosInstance.ts`.** It owns the Bearer token,
   `Accept-Language`, `X-Timezone`, single-flight refresh (`/auth/token/refresh/`),
   `skipAuth`/`skipRefresh` for public endpoints, and the session-expired redirect.
   No second axios instance.
3. **Single sign-out path: `useSignOut`.** It blacklists the refresh token (and the
   rotated one, fire-and-forget), clears the session, the auth store and the query
   cache, and returns to `/login`. Never hand-roll sign-out.
4. **`npm run check` before committing** — typecheck + lint + format:check + tests.
   CI (`.github/workflows/ci.yml`) runs the same gate, no exceptions.
5. **No silent failures.** Errors surface via `src/api/errors.ts` (`normalizeApiError`,
   `extractErrorMessage`). Empty `catch {}` in UI code is banned.
6. **Accessibility is a hard requirement, not polish** (see §7).
7. **Pages are thin.** TSX in `pages/` orchestrates; UI lives in `components/<domain>/`.
8. **Generic stays generic.** No domain terms, sample data, or marketing copy that
   presumes one specific product.

## 2. Tech stack

| Layer          | Technology                | Notes                                                          |
| -------------- | ------------------------- | -------------------------------------------------------------- |
| Framework      | React 19                  | —                                                              |
| Language       | TypeScript 5.x            | strict                                                         |
| Bundler        | Vite 7                    | manualChunks (react / query / radix / gsap), lazy routes       |
| Styling        | Tailwind CSS v4           | CSS variables in `index.css`, nesting                          |
| UI primitives  | Radix (`radix-ui`)        | via shadcn/ui                                                  |
| Animation      | GSAP + Lenis              | respects `prefers-reduced-motion` (`lib/motion.ts`)            |
| State (client) | Zustand                   | `auth` store persisted, `preferences` store                    |
| State (server) | TanStack Query 5          | singleton client in `lib/queryClient.ts`                       |
| HTTP           | Axios                     | see `src/api/`                                                 |
| Routing        | React Router 7            | lazy-loaded; `<SessionBridge/>` restores the persisted session |
| i18n           | i18next + react-i18next   | en/ar; direction via `applyDirection`                          |
| Fonts          | DM Sans + JetBrains Mono  | loaded non-render-blocking                                     |
| Testing        | Vitest 4 + RTL 16 + jsdom | axe-core a11y scans                                            |

## 3. Project structure

```text
src/
├── api/                       # everything talks to the server from here
│   ├── contracts.ts           # wire shapes — auth/response/error/token types
│   ├── errors.ts              # ApiError + normalizeApiError + extractErrorMessage
│   ├── session.ts             # localStorage token pair (loadSession/hasSession)
│   ├── axiosInstance.ts       # Bearer + headers + single-flight refresh
│   ├── accounts/              # auth + multi-account hooks (me/accounts/OTP/avatar/social)
│   ├── notifications/         # inbox, devices, reminders
│   ├── types.ts               # re-exports used across the API surface
│   └── index.ts               # barrel
├── components/
│   ├── auth/                  # AuthLayout, FormError, OAuthButtons, … (routed pages use these)
│   ├── landing/               # LandingPage (used by /)
│   ├── theme/                 # ThemeProvider + ModeToggle
│   ├── ui/                    # shadcn primitives + project UI (field, toast, …)
│   ├── SeoUpdater.tsx         # per-route <title>/meta/OG/canonical
│   ├── header.tsx, logo.tsx   # starter chrome
│   └── ShapeWaves.tsx         # WebGPU hero waves (lazy; not in critical path)
├── hooks/                     # useDebounce, useIsMobile, useMediaQuery, useNearView,
│                              # useSectionTracker, useConnection, useRefresh (+ barrel)
├── i18n/                      # i18next init; locales/{en,ar}/{common,errors,account}
├── lib/                       # constants, date, queryKeys, queryClient, sessionReset,
│                              # motion, seo, smoothScroll, validators, utils, vitals, index
├── pages/                     # lazy routes: Home + auth/* (thin orchestrators)
├── store/                     # auth (persist+useSignOut), preferences, persist helper
├── types/                     # shared TS interfaces
├── test/                      # Vitest setup + axe helpers
├── App.tsx                    # routes; <SessionBridge/>
├── MainLayout.tsx             # <main id="main-content"> + <Outlet/> wrapper
└── main.tsx                   # providers, GSAP registration, vitals
```

Notes:

- `astral/`, `projects/`, `headers/`, `buttons/`, `bits/`, `layout/` under `components/`
  are **unreferenced legacy** from an earlier portfolio shape — no imports reach them.
  Do not extend them; ask before deleting them.
- Untracked `SKILL_RULES.md`, `src/lib/motion.ts`, `src/hooks/useMediaQuery.ts`,
  `src/components/ui/cyber-frame*` and flanking files are in-progress work from another
  session — leave them alone unless you are that session.
- `docs/` holds per-domain guides: read the one touching your change; keep it current.

## 4. Key conventions

### 4.1 The API layer

Each backend domain follows the three-file pattern:

```text
api/<domain>/
├── endpoints.ts   # types + paths + API functions (one const object: domainApi)
├── hooks.ts       # React Query hooks (useQuery/useMutation), onError wired
└── index.ts       # barrel
```

- `endpoints.ts` exports `domainApi` (axios calls) and `domainEndpoints` (paths).
- `hooks.ts` exports `use<Verb><Noun>` hooks. Every mutation hook surfaces errors
  through `extractErrorMessage` — never let it swallow.
- New domain → also add keys to `lib/queryKeys.ts`, and export from `api/index.ts`.
- **The backend serves `/api/v1`; auth lives under `/api/v1/auth/`.** `API_V1_ROOT`
  and `AUTH_ROOT` in `lib/constants.ts` are the only places those constants exist —
  never re-derive them from strings.
- **Refresh rotation:** `axiosInstance` rotates single-flight on 401
  (`isTokenFailure` decides: only `ERROR_CODES.UNAUTHORIZED` rotates). Public paths
  (`/auth/login/`, `/auth/register/`, `/auth/password-reset/`, `…social/`,
  `/auth/verify-email`) never attempt refresh. A failed refresh signs the user out.
- **Error envelope** is `{ error: { code, message, message_ar?, fields?, detail? } }`
  (HTTP 429 carries `Retry-After`). `normalizeApiError` maps every axios rejection
  to `ApiError` (`status`, `code`, `messageAr`, `fields`, `retryAfter`).

### 4.2 Auth surface (`src/api/accounts/`)

Exports the complete flow: register (with `role`), verify-email + resend, login,
`me`, token refresh/blacklist/verify, accounts list + add/login/request/verify/resend

- remove, avatar upload/remove, password change, email change, password reset
  request/confirm, social (`google`/`apple`/`facebook`). `toUser(...)` adapts the API
  user into `types/User`. The auth pages in `pages/auth/` consume these hooks —
  no page hand-rolls requests.

### 4.3 Naming

| What             | Convention                 | Example                          |
| ---------------- | -------------------------- | -------------------------------- |
| API functions    | camelCase on a named const | `accountsApi.login`              |
| Hooks            | `use<Verb><Noun>`          | `useLogin`, `useAuthCurrentUser` |
| Pages            | Default export, PascalCase | `export default function Home()` |
| Other components | Named export, PascalCase   | `export function OAuthButtons()` |
| Types            | PascalCase                 | `RegisterRequest`                |

### 4.4 Import order

`eslint-plugin-import-x` enforces it — builtins → external → internal (`@/…`) →
parent/sibling → index; alphabetical within group, blank line between groups.
`npx eslint . --fix` fixes ordering.

### 4.5 Components

- Pages in `pages/` are default-export thin orchestrators: hooks + handlers + JSX
  composition. Everything else lives in `components/<domain>/` with named exports and a
  barrel `index.ts`.
- Use existing `components/ui/` primitives; never raw `<button>`/`<input>` when one exists.
- Components receive data via props; they don't reach into stores directly.
- Every state is designed: loading (skeleton), empty, error (retry), success.

### 4.6 State ownership

| State                  | Tool                                        | Persisted          |
| ---------------------- | ------------------------------------------- | ------------------ |
| Auth user + tokens     | Zustand `useAuthStore` (+ `rapido.session`) | Yes (localStorage) |
| Preferences (language) | Zustand `usePreferencesStore`               | Yes                |
| Server data            | React Query                                 | Cache only         |
| Form/UI                | `useState`                                  | No                 |
| URL                    | React Router                                | URL                |

- Sessions: `lib/session.ts` reads/writes `rapido.session` (single write path).
  `setHasSession(hasSession())` runs at boot (`main.tsx`) and on logout.
- `SessionBridge` inside `App.tsx` only mounts `useAuthCurrentUser` — it restores the
  signed-in user from a persisted token pair on boot and navigates nowhere. Put
  route-guard redirects in routes, not in the bridge.
- Account-switch sequence lives in `lib/sessionReset.ts`
  (`clearQueryCache` / `setAuthUser` / `refreshAuthMe` / `switchAccountSession`) — the
  single source for wiping per-account state.

### 4.7 i18n

- i18next + react-i18next. Namespaces today: `common`, `errors`, `account` —
  **en + ar** catalogs in `src/i18n/locales/`.
- Default language from `VITE_LANGUAGE` (fallback `en`); user choice persists
  (`rapido.language`). `applyDirection` sets `<html dir>`/`lang` (Arabic → `rtl`).
- `Accept-Language` rides on every request; `X-Timezone` (IANA via `Intl`) too —
  the backend activates both per request.
- New user-facing strings: add both `en` and `ar` keys. `MODELTRANSLATION_FALLBACK`
  analog does not exist on the web side — a missing `ar` string is a bug.
- Screen strings are not yet migrated to `t()` everywhere; when you touch a screen,
  move its strings into the catalogs.

### 4.8 Quality gate

`npm run check` = `typecheck` + `lint` + `format:check` + `test`. Non-negotiable rules:

- `@typescript-eslint/no-non-null-assertion`
- `no-console` (only `warn`/`error` allowed)
- `import-x/order` (above)
- `max-lines` ≤ 200 on `src/pages/**`

## 5. Performance (Web Vitals)

Targets to beat: FCP < 1.8s, LCP < 2.5s, CLS < 0.1, TBT < 200ms, INP < 200ms.

- Hero/LCP image: WebP/AVIF, explicit `width`/`height`, `fetchPriority="high"`.
- Below-fold images: `loading="lazy" decoding="async"`.
- Fonts: async `media="print"` swap + `<noscript>`; `font-display: swap`.
- Split with lazy routes + `manualChunks` in `vite.config.ts`; no heavy SDK in the
  critical path — dynamic `import()` only at point of use.
- Client paint: skeleton in `index.html`, fade out on mount.
- Animations: transform/opacity only; respect `prefers-reduced-motion`
  (`lib/motion.ts` is your reduced-motion-aware helper).
- React Query: sane `staleTime`/`gcTime` in `lib/queryClient.ts` (retry transient
  failures only, backoff); `useDebounce` for search inputs.

The system of record for budgets is `docs/Performance.md` — read and update it with any
perf-relevant change.

## 6. SEO

- Build-time `robots.txt` + `sitemap.xml` via the `siteFiles` Vite plugin; host from
  `VITE_SITE_URL`. Add new routes to `SITEMAP_PATHS` in `vite.config.ts`.
- `index.html` carries the full head: OG, Twitter, geo, JSON-LD, fonts async.
- Per-route meta via `SeoUpdater` + `ROUTE_SEO` in `lib/seo.ts`. **Every new route in
  `App.tsx` gets an entry in `ROUTE_SEO`.** Detail pages append dynamic data to
  `document.title` in a `useEffect`.
- Every route reachable through `<Link>`; never click-only navigation.
- `docs/SEO.md` is the deep dive — update it when the head or sitemap strategy changes.

## 7. Accessibility

- First tab stop is the skip-to-content link; `<main id="main-content">`. Note the
  `MainLayout` skip link is commented out pending a navbar — `LandingPage` ships its own
  inline one — keep both, and re-enable the shell one when chrome lands.
- Global `:focus-visible` ring; global reduced-motion media query collapses animation.
- Meaningful `alt` on images (`alt=""` decorative); labels on every control;
  errors via `role="alert"` + `aria-describedby`.
- Semantic HTML; Radix primitives over hand-rolled widgets.
- RTL: `dir="rtl"` when `ar` is active (Arabic catalog in use); logical properties
  (`ms-`/`me-`, `start`/`end`) over left/right.
- axe-core runs in Vitest (`src/test/axe.ts`); a11y tests must stay green.
- `docs/Accessibility.md` — keep in sync.

## 8. Common tasks

**Add an API domain**

1. `api/<domain>/endpoints.ts` (types + paths + functions), `hooks.ts`, `index.ts`
2. Keys in `lib/queryKeys.ts`; barrel in `api/index.ts`
3. Error codes → both locale catalogs if genuinely new

**Add a page**

1. `pages/<Page>.tsx`, default export
2. Lazy import + route in `App.tsx`
3. Path in `ROUTES` (`lib/constants.ts`)
4. Copy in `ROUTE_SEO` (`lib/seo.ts`)

**Add an endpoint to a domain** — extend `endpoints.ts`, add/adjust hook, update `queryKeys` if the shape implies new caches; never bypass `axiosInstance`.

**Add a hero image** — WebP/AVIF, explicit dimensions, `fetchPriority="high"` (LCP) or lazy loading, aspect container.

**Add a translation** — add keys to both `locales/en/*.ts` and `locales/ar/*.ts`.

**Add a heavy SDK** — dynamic `import()` at point of use; never mixed static+dynamic imports of the same module.

## 9. Environment variables

| Variable                                                     | Required                    | Used in                                     |
| ------------------------------------------------------------ | --------------------------- | ------------------------------------------- |
| `VITE_API_URL`                                               | No (default localhost:8000) | `lib/constants.ts` → `API_V1_ROOT`          |
| `VITE_SITE_URL`                                              | No (default example.com)    | `seo.ts`, `vite.config.ts` (robots/sitemap) |
| `VITE_APP_NAME`                                              | No (default `Rapido`)       | `lib/constants.ts`                          |
| `VITE_LANGUAGE`                                              | No (default `en`)           | `i18n/index.ts`                             |
| `VITE_NETWORK_CHECK`                                         | No (`auto`)                 | `hooks/useConnection.ts` (`dev` only)       |
| `VITE_CONTACT_EMAIL`, `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL` | No                          | landing contact block                       |
| `VITE_ANALYTICS_ENDPOINT`                                    | No                          | analytics beacon (if enabled)               |

Never commit `.env`. Typing in `src/vite-env.d.ts` — extend it when you add a variable.

## 10. CI gate

`.github/workflows/ci.yml` runs on every push to `main` and every PR: `npm ci`,
`typecheck`, `lint`, `format:check`, `test`, `build`. Red pipeline = not ready. Keep it.

## 11. Boundaries with the backend

- `django-rapido` serves the contract; auth mounts at `/api/v1/auth/`.
- OTP flows expect `X-Timezone` / `Accept-Language` from the client.
- Error throttling is server-side; respect `Retry-After` (exposed on `ApiError.retryAfter`).
- Contract change = coordinated change in both repos in the same releasable slice.
