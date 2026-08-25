# AGENTS.md — The Portfolio

This document is the single source of truth for AI coding assistants working on this project. It captures the **organizational and Web Vitals principles** that make a React frontend excellent: structure, conventions, performance, SEO, and accessibility.

> This is my personal portfolio — the code IS the first impression. Every change should make it faster, sharper, or more alive. If a change makes it slower, uglier, or harder to use: reject it. The bar is "a senior designer and a senior engineer would both sign off."

---

# Part A — Project Context

## 0. What This Site Is

A personal portfolio: the public face of my work on the web.

- **Home / hero** — WebGL-backed visual moment (MoltenMetal shader background, MagicBento cards), fast first paint despite the flair
- **Work showcase** — projects with real detail pages, reachable via `<Link>` (crawlable)
- **About & contact** — human, direct, no corporate filler
- **Auth stack** — inherited intact from the template (login/register/reset/OTP); reserved for a future private admin/dashboard area, not part of the public story

Design direction: confident, dark-leaning, atmospheric visuals over an engineering-grade foundation. Motion earns its place — GPU-friendly, subtle, always respecting `prefers-reduced-motion`.

## 1. Tech Stack

| Layer         | Technology                   | Notes                                                      |
| ------------- | ---------------------------- | ---------------------------------------------------------- |
| Framework     | React 19                     | —                                                          |
| Language      | TypeScript 5.x               | strict mode                                                |
| Bundler       | Vite 7+                      | HMR, code splitting                                        |
| Styling       | Tailwind CSS v4              | CSS variables, nesting                                     |
| UI primitives | Radix UI (`radix-ui`)        | via shadcn/ui                                              |
| Animations    | `motion` (framer-motion v12) | use sparingly; respect `prefers-reduced-motion`            |
| Shaders / FX  | `ogl`, `gsap`                | WebGL hero visuals only; never in the critical bundle path |
| Icons         | `lucide-react`               | —                                                          |
| Client state  | Zustand                      | persisted auth store                                       |
| Server state  | TanStack Query v5            | mutations, queries                                         |
| HTTP          | Axios 1.x                    | interceptors                                               |
| Routing       | React Router v7              | lazy-loaded routes                                         |
| Font          | DM Sans + JetBrains Mono     | loaded non-render-blocking                                 |
| Testing       | Vitest 4 + RTL 16 + jsdom    | axe-core a11y scans                                        |

## 2. Project Structure

```
src/
├── api/                          # Domain-separated API layer (3-file pattern per domain)
│   ├── accounts/                 # Auth: endpoints.ts + hooks.ts + index.ts
│   ├── profile/                  # Profile endpoints
│   ├── users/                    # User endpoints
│   ├── axiosInstance.ts          # Axios config, auth interceptor, error normalization
│   ├── types.ts                  # Shared response types
│   └── index.ts                  # Barrel re-export
│
├── components/
│   ├── auth/                     # AuthLayout, FormDivider, FormError, OAuthButtons
│   ├── astral/                   # Atmospheric visuals: AuroraBackground, GridHighlight
│   ├── bits/                     # Showpiece widgets: MagicBento, MoltenMetal (WebGL/GLSL)
│   ├── layout/                   # Navbar
│   ├── theme/                    # ThemeProvider, ModeToggle (dark/light/system)
│   ├── ui/                       # shadcn primitives: button, input, card, select, label, ...
│   └── SeoUpdater.tsx            # Per-route <title>/description/OG/canonical (SEO)
│
├── hooks/
│   ├── useDebounce.ts            # Generic debounce hook
│   └── index.ts                  # Barrel re-export (also re-exports from api/accounts/hooks)
│
├── lib/
│   ├── constants.ts              # ROUTES, APP_NAME, API_BASE_URL
│   ├── seo.ts                    # SITE_NAME, SITE_URL, ROUTE_SEO, route matcher
│   ├── queryClient.ts            # Shared React Query client (singleton)
│   ├── utils.ts                  # cn() — tailwind-merge + clsx
│   ├── validators.ts             # Form validation patterns
│   └── markdown.tsx              # Simple markdown-to-JSX renderer
│
├── pages/                        # Lazy-loaded route components (thin orchestrators)
│   ├── Home.tsx                  # Hero: MoltenMetal background + MagicBento showcase
│   └── auth/                     # Login, Register, ForgotPassword, VerifyOTP, ResetPassword
│
├── store/
│   └── auth/authStore.ts         # Zustand store (persisted)
│
├── types/                        # Shared TS interfaces
│   ├── auth.ts, user.ts
│   └── index.ts                  # Barrel re-export
│
├── test/                         # Vitest infra: setup-env.ts, setup.ts, axe.ts, *.test.*
├── App.tsx                       # Route definitions, lazy imports, SeoUpdater
├── MainLayout.tsx                # Layout shell: skip-link + Navbar + <main id="main-content"> + Outlet
├── index.css                     # Tailwind entry, design tokens, reduced-motion, :focus-visible
├── main.tsx                      # Provider tree + loading-skeleton fadeout
└── vite-env.d.ts                 # ImportMetaEnv augmentation (typed env vars)
```

---

# Part B — Organization & Conventions

## 3. Key Conventions

### 3.1 API Layer Pattern

Each domain follows a strict three-file pattern:

```
api/<domain>/
├── endpoints.ts      # API function calls + TypeScript interfaces for request/response
├── hooks.ts          # React Query hooks (useQuery, useMutation)
└── index.ts          # Barrel re-export
```

- `endpoints.ts` exports a const object `domainApi` with axios calls and a const `domainEndpoints` with URL paths
- `hooks.ts` exports named hooks following the `use<Action>` pattern
- Every mutation hook gets an `onError` handler that surfaces errors via `extractErrorMessage`
- If your backend uses a specific URL convention (snake_case actions, trailing slashes, etc.), document it here

### 3.2 Naming

| What               | Convention                                  | Example                          |
| ------------------ | ------------------------------------------- | -------------------------------- |
| API functions      | `camelCase` on a named const                | `accountsApi.login`              |
| Hooks              | `use<Verb><Noun>`                           | `useLogin`, `useRegister`        |
| Mutation variables | `mutate({ data })` with destructured params | —                                |
| Page components    | Default export, PascalCase                  | `export default function Home()` |
| Other components   | Named export, PascalCase                    | `export function OAuthButtons()` |
| Types/interfaces   | PascalCase                                  | `RegisterRequest`                |
| CSS classes        | Tailwind utility classes                    | no custom CSS files              |

### 3.3 Imports Order

Enforced automatically by `eslint-plugin-import-x` (`import-x/order`) — alphabetical within group, blank line between groups:

1. Builtins
2. External (third-party libraries: `react`, `axios`, `@tanstack/react-query`, `lucide-react`, `motion`)
3. Internal (`@/components/...`, `@/api/...`, `@/store`, `@/lib/...`)
4. Parent / sibling (relative `./...`, `../...`)
5. Index

Run `npx eslint . --fix` to auto-sort imports.

### 3.4 Always Use Components

Every UI element MUST use an existing component from `@/components/ui/` if one is available (Button, Input, Select, Badge, Card, etc.). If no component exists for the need, create one in `@/components/ui/` (for primitives) or `@/components/<domain>/` (for business components). Never use raw HTML elements (`<button>`, `<input>`, `<select>`, etc.) when a component exists.

### 3.5 No Comments in Implementation Code

Business logic files should NOT have explanatory comments. Code should be self-documenting through clear naming. Comments are reserved for:

- JSDoc on public API functions
- Section headers in complex files (e.g., `axiosInstance.ts` interceptor sections)

### 3.6 Component Architecture — Decoupled & Reusable

Every UI piece must be extracted into its own component file. Pages are thin orchestrators — they fetch data, compose components, and wire event handlers. The `components/` directory mirrors domain areas:

```
components/<domain>/
├── ComponentOne.tsx    # Named export, single responsibility
├── ComponentTwo.tsx
└── index.ts            # Barrel re-export
```

**Rules:**

- If a piece of UI appears in more than one page, extract it into `components/<domain>/`
- Even if used once, extract if it has clear boundaries (form, card, filter panel, summary block)
- Components receive data and callbacks via props — never access stores, routers, or query hooks directly
- Use `children` slots for action buttons / custom content
- Each component directory has a barrel `index.ts`; pages import from the barrel, never from the file directly
- No single file should contain multiple major UI sections — split into separate component files

**Pages should look like this:**

```tsx
export default function SomePage() {
  // 1. Hooks: auth, data fetching, mutations
  // 2. Event handlers (thin, delegate to mutations)
  // 3. Render: compose components, pass props
}
```

### 3.7 State Ownership

| State                                   | Tool             | Persisted?         |
| --------------------------------------- | ---------------- | ------------------ |
| Auth (user, token)                      | Zustand          | Yes (localStorage) |
| Server data (queries, mutations)        | React Query      | No (cache only)    |
| UI state (form inputs, modals, toggles) | React `useState` | No                 |
| URL state (search params, route)        | React Router     | Yes (URL)          |

### 3.8 Linting, Formatting, Type Checking & Tests

Formatting is enforced with **Prettier** (`.prettierrc.json`); consistency across editors comes from `.editorconfig`. Both are **gated in CI** (`.github/workflows/ci.yml`) and by the `check` script:

```bash
# One command: typecheck + lint + format check + tests
npm run check

# Type check only
npm run typecheck

# Lint (eslint)
npm run lint

# Format the whole repo
npm run format

# Verify formatting without modifying
npm run format:check

# Tests
npm run test
```

Always run `npm run check` before committing. Do not commit code with type errors, lint errors, or formatting drift. Non-negotiable ESLint rules in this template (beyond the recommended sets):

- `@typescript-eslint/no-non-null-assertion` — forbids `user!`-style assertions; guard explicitly instead
- `no-console` — `console.warn`/`console.error` allowed, `console.log` banned
- `import-x/order` — import grouping enforced (see 3.3)
- `max-lines` (≤ 200 on `src/pages/**`) — keeps pages thin per the component architecture rule

---

# Part C — Web Vitals & Performance Playbook

This is the playbook that earns green Lighthouse scores: **FCP 0.5s, CLS 0.001, LCP < 2.5s target**.

## 4. Core Metrics

| Metric          | What it measures                                           | Good target              |
| --------------- | ---------------------------------------------------------- | ------------------------ |
| **FCP**         | First Contentful Paint — first text/image paints           | < 1.8s                   |
| **LCP**         | Largest Contentful Paint — biggest visible element appears | < 2.5s                   |
| **CLS**         | Cumulative Layout Shift — unexpected layout jumps          | < 0.1                    |
| **TBT / INP**   | Main-thread blocking / interaction responsiveness          | TBT < 200ms, INP < 200ms |
| **Speed Index** | How quickly content is visually complete                   | < 3.4s                   |

## 5. LCP Rules (biggest element = fastest)

1. **The LCP element is usually the hero image.** Compress it aggressively:
   - Convert raster posters/photos to **WebP** (`ffmpeg -i in.png -c:v libwebp -quality 82 out.webp` — typically 10–16x smaller). AVIF is even better where supported.
   - Never ship a multi-MB PNG on the critical path. A 1.4 MB PNG ≈ 7s LCP on throttled 4G; a 92 KB WebP ≈ 0.5s.
2. Mark the LCP image `fetchPriority="high"` and give it explicit `width` + `height`.
3. **Load fonts non-render-blocking**: async `media="print" onload="this.media='all'"` + `<noscript>` fallback. Use `font-display: swap`.
4. **Minify + split JavaScript**: Vite minifies by default; add `manualChunks` for stable vendor splits (react, query, radix, motion, i18n). Lazy-load every route.
5. **Keep heavy SDKs out of the main bundle**: load them via dynamic `import()` only when needed (e.g., post-auth), never as a static import in the critical path.
6. Serve a **loading skeleton** (inline in `index.html`) and fade it out once React mounts — avoids a blank screen flash and improves perceived FCP.

## 6. CLS Rules (zero layout shift)

1. Every image has explicit `width`/`height` attributes OR is inside a fixed-aspect container (`aspect-square`, `aspect-video`).
2. Below-fold images use `loading="lazy"` + `decoding="async"` (render-safe decode).
3. Fonts use `font-display: swap`; font metrics must not shift layout on load.
4. Never inject content (banners, toasts, images) above the fold without reserving space.
5. Set `width`/`height`/`viewBox` on all SVGs.

## 7. INP / Main-Thread Rules

1. Minimize work on the critical path: small, lazy chunks; no heavy animation libs in initial render unless needed.
2. Debounce search/filter inputs (`useDebounce`).
3. Pause background polling when not needed: `refetchIntervalInBackground: false`, `staleTime`.
4. Animations should be CSS transforms/opacity (GPU-friendly), not layout properties.
5. React Compiler + `useMemo`/`useCallback` for expensive derived values; avoid `setState` in `useEffect` (triggers re-render loops).

## 8. Lighthouse Diagnostic Vocabulary

| Lighthouse diagnostic                                  | Likely root cause & fix                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| "Minify JavaScript" / huge savings                     | You're measuring a **dev build** (unminified). Re-run against `npm run build` output / production URL. |
| "Reduce unused JavaScript"                             | Dead routes/libs still bundled; remove unused deps; tighten lazy chunks.                               |
| "Avoid enormous network payloads"                      | Heavy images (→ WebP), huge bundles (→ split), or unminified JS.                                       |
| "Improve image delivery"                               | Serve WebP/AVIF with `srcset`; add explicit dimensions.                                                |
| "Duplicated JavaScript"                                | A module statically imported in two chunks. Standardize on one.                                        |
| "Use efficient cache lifetimes"                        | Set `Cache-Control: max-age` on static assets at the hosting layer.                                    |
| "Image elements do not have explicit width and height" | Add `width`/`height` attrs or aspect containers.                                                       |

**Debugging rule of thumb**: FCP fast + LCP slow ⇒ the LCP element's _resource_ is slow (image size, late discovery, render-blocking). CLS > 0.1 ⇒ missing reserved space for images/fonts. TBT > 200ms ⇒ too much JS on the main thread.

---

# Part D — SEO & Crawlability Playbook

## 9. Build-time artifacts (robots.txt + sitemap.xml)

Emitted by a small Vite plugin (`siteFiles` in `vite.config.ts`) on every build, so they can never go stale:

- `robots.txt` → `User-agent: *` / `Allow: /` / `Sitemap: <SITE_URL>/sitemap.xml`
- `sitemap.xml` → static routes with priorities (home 1.0, secondary 0.5, legal 0.3)
- Host comes from `VITE_SITE_URL` (default `https://example.com`)

## 10. Head meta (index.html)

One hand-written, complete `<head>` in `index.html`:

- `charset`, `viewport`, `description`, `author`, `robots` (`index, follow`)
- `theme-color` (light + dark), `color-scheme`
- `canonical` → `VITE_SITE_URL`
- **Open Graph**: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (+ `og:image:width/height/alt`), `og:locale`, `og:locale:alternate` (for multilingual sites)
- **Twitter card**: `summary_large_image`, `twitter:title/description/image`
- **Geo meta** for local businesses: `geo.region`, `geo.placename`, `ICBM`, `geo.position`
- `favicon`, `apple-touch-icon`, `msapplication-TileColor`
- **JSON-LD** structured data: `Organization` + `WebSite` (with `inLanguage` for each locale)
- All assets (fonts, images) referenced with non-render-blocking patterns

## 11. Per-route SEO (SPA)

Single-page apps get one `<title>` unless you handle it per route. This template uses:

- `src/lib/seo.ts` — `SITE_NAME`, `SITE_URL`, `ROUTE_SEO` map (route pattern → title/description), and a `matchRouteSeo()` helper.
- `src/components/SeoUpdater.tsx` — renders `null`; on route change it upserts `document.title`, `<meta name="description">`, OG tags, and the canonical link.
- Wire it **inside the Router, above `<Suspense>`**, so every route gets meta.
- Detail pages append dynamic data to the title (e.g., product name) in a `useEffect`.

**When adding a route, always add its SEO copy to `ROUTE_SEO`.**

## 12. SPA crawlability notes

- Google renders client-side JS, but deliver a fast, meaningful first paint anyway (they use FCP/LCP as ranking signals).
- Keep every route reachable via `<Link>` (crawlers follow links), never only via JS events.

---

# Part E — Accessibility (a11y) Playbook

## 13. Structural a11y (must-haves)

1. **Skip-to-content link** — first focusable element in every layout; `href="#main-content"`; `<main id="main-content" tabIndex={-1}>`. Use `sr-only focus:not-sr-only focus:fixed ...` styling so it appears only on focus.
2. **`:focus-visible` outline** — a global rule in `index.css` so every keyboard-focused element has a visible ring:
   ```css
   :focus-visible {
     outline: 3px solid var(--ring);
     outline-offset: 2px;
   }
   ```
3. **`prefers-reduced-motion`** — a global media query that collapses animations/transitions to ~0 for users who ask:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
4. **Alt text** — meaningful `alt` on every informative image; `alt=""` on decorative ones (never omit the attribute).
5. **Labels** — every form control has a visible `<Label>` or `aria-label`; errors are announced with `aria-describedby` / `role="alert"`.
6. **Semantic HTML** — use real `<button>`, `<a>`, `<nav>`, `<main>`, `<section>`/headings; never fake buttons with `<div onClick>`.
7. Radix primitives bring accessible dialog/select/tabs behavior for free — prefer them over hand-rolled widgets.

## 14. Automated a11y enforcement

- **axe-core scans run in Vitest** (`src/test/axe.ts` + `a11y-*.test.tsx`): render components, run `axe()`, assert no serious violations.
- Test infra requirements: `IS_REACT_ACT_ENVIRONMENT` set in `src/test/setup-env.ts` (must stay first in `setupFiles`); `waitFor` must not be nested inside `act()`; test files import from `vitest`.
- For RTL/multilingual sites: ensure `dir="rtl"` handling, mirrored layouts, and logical properties (`ms-`/`me-`, `start`/`end`).

---

# Part F — UI/UX & Design System

## 15. Design tokens

- All colors/radii/shadows are **CSS variables** defined in `index.css` under `@theme inline` and exposed as Tailwind utilities (`bg-primary`, `text-muted-foreground`, etc.). Never hardcode hex values in components.
- One primary brand color + one accent, applied globally. Light/dark via `.dark` class (tailwind `dark:` variant).

## 16. UI quality bar

- **Pages are thin** — data fetching + event wiring only; all UI lives in `components/<domain>/`.
- **Every state is designed**: loading (skeleton), empty, error (retry), and success. No unhandled `undefined` renders.
- **All failures are surfaced** to the user via `extractErrorMessage` — never silent `catch {}` in UI code.
- **Responsive mobile-first**; nav collapses to a drawer/sheet on small screens.
- **Motion is restrained**: entrance animations subtle, GPU-friendly, and disabled under `prefers-reduced-motion`.
- Interactive elements have visible hover + focus states and adequate touch targets (≥ 44px).

---

# Part G — Common Tasks

### Adding a new API domain

1. Create `api/<domain>/endpoints.ts` with types, endpoint paths, and API functions
2. Create `api/<domain>/hooks.ts` with React Query hooks (add `onError`)
3. Create `api/<domain>/index.ts` barrel export
4. Add export to `api/index.ts`

### Adding a new page

1. Create `pages/<PageName>.tsx` with a default export
2. Add lazy import in `App.tsx`: `const PageName = lazy(() => import('@/pages/<PageName>'))`
3. Add route in `App.tsx` with the appropriate path and layout
4. Add the route path to `ROUTES` in `lib/constants.ts`
5. **Add SEO copy for the route** to `ROUTE_SEO` in `lib/seo.ts`

### Adding a new API endpoint to an existing domain

1. Add the function to the domain's `endpoints.ts`
2. Add or update the hook in `hooks.ts`
3. If creating a new hook file, add export to `index.ts`

### Adding a hero/LCP image

1. Export as WebP/AVIF (never a large PNG)
2. Add explicit `width` + `height`
3. Mark `fetchPriority="high"` if it's the LCP element; `loading="lazy"` + `decoding="async"` otherwise
4. Ensure its container reserves space (aspect ratio) to keep CLS at 0

### Adding a heavy third-party SDK

1. Keep it out of the main bundle: dynamic `import()` at the point of use
2. Never mix static + dynamic imports of the same module (causes duplicated JS)

### Adding a route to the sitemap

Add it to `SITEMAP_PATHS` in `vite.config.ts` (it regenerates on every build).

---

# Part H — Continuous Integration

## 17. CI Gate

`.github/workflows/ci.yml` runs on every push to `main` and on every pull request. It is the **enforcement point** for all the standards above — never rely on self-discipline alone:

1. `npm ci` (reproducible installs)
2. `npm run typecheck`
3. `npm run lint`
4. `npm run format:check`
5. `npm run test`
6. `npm run build`

A red pipeline means the PR is not ready to merge, period. When you start a new project from this template, the workflow comes with it — keep it.

---

# Part I — Environment Variables

| Variable        | Required         | Used In                                               |
| --------------- | ---------------- | ----------------------------------------------------- |
| `VITE_API_URL`  | No (has default) | `axiosInstance.ts`                                    |
| `VITE_APP_NAME` | No (has default) | `constants.ts`                                        |
| `VITE_SITE_URL` | No (has default) | `seo.ts`, `vite.config.ts` (robots/sitemap/canonical) |

Never commit `.env` files. Type env vars in `src/vite-env.d.ts` (`ImportMetaEnv`) so `import.meta.env.VITE_*` is checked at compile time.
