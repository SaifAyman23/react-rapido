# REACT RAPIDO — BRUTAL STARTER

```
┌────────────────────────────────────────────────────┐
│  RR  //  01          REACT RAPIDO  V1.0  —  2026   │
│                                                    │
│  BUILD                                             │
│  FASTER.                                           │
│                                                    │
│  React 19 + TS 5 + Vite 7 + Tailwind v4            │
│  No fluff. No bloat. Just ship.                    │
└────────────────────────────────────────────────────┘
```

**PRODUCTION-READY // 0 RUNTIME DEBT — brutal, clean, fast.**

Thin pages. Decoupled components. 3-file API. Auth + SEO + a11y baked in.

---

### TAGS

![React](https://img.shields.io/badge/REACT-19-000000?style=flat-square&labelColor=8B5CF6&color=000000)
![TypeScript](https://img.shields.io/badge/TYPESCRIPT-5-000000?style=flat-square&labelColor=8B5CF6&color=000000)
![Vite](https://img.shields.io/badge/VITE-7-000000?style=flat-square&labelColor=000000&color=8B5CF6)
![Tailwind](https://img.shields.io/badge/TAILWIND-v4-000000?style=flat-square&labelColor=000000&color=8B5CF6)
![Zustand](https://img.shields.io/badge/ZUSTAND-persist-000000?style=flat-square)
![TanStack](https://img.shields.io/badge/TANSTACK-QUERY_5-000000?style=flat-square&labelColor=8B5CF6&color=000000)
![CI](https://img.shields.io/badge/CI-PASSING-000000?style=flat-square&labelColor=000000&color=22C55E)
![LCP](https://img.shields.io/badge/LCP-%E2%89%A42.5s-000000?style=flat-square)
![CLS](https://img.shields.io/badge/CLS-0.00-000000?style=flat-square)
![License](https://img.shields.io/badge/LICENSE-MIT-000000?style=flat-square)

`BRUTAL` `CLEAN` `FAST` `RAW`

---

### TABLE OF CONTENTS

```
01  SPECS
02  QUICK START
03  STRUCTURE
04  STACK
05  ROUTING
06  QUALITY GATE
07  SECURITY
08  DOCS
```

---

### 01 — SPECS

```
┌──────────────┬─────────────────────────────┐
│  LCP         │ ≤2.5s  [GOOD]               │
│  CLS         │ 0.00   [PERFECT]            │
│  TBT         │ ≤200ms [FAST]               │
│  AUTH        │ JWT + OTP                  │
│  SEO         │ per-route meta + sitemap   │
│  A11Y        │ axe-core + focus ring      │
└──────────────┴─────────────────────────────┘
```

- THE BAR IS “SENIOR DESIGNER + SENIOR ENGINEER WOULD BOTH SIGN OFF” — AGENTS.md. Build fails if you add 100KB of junk.

---

### 02 — QUICK START

```bash
# 01 — clone
git clone https://github.com/SaifAyman23/react-rapido my-app
cd my-app

# 02 — install
npm i

# 03 — env
cp .env.example .env
# set VITE_API_URL, VITE_SITE_URL, VITE_APP_NAME

# 04 — dev
npm run dev
# → http://localhost:5173
```

```
┌─────────────────────────────────────┐
│  $ npm run dev   — HMR 40ms         │
│  $ npm run check — type/lint/fmt/test │
└─────────────────────────────────────┘
```

---

### 03 — STRUCTURE

```
src/
├── api/               # 3-file pattern per domain
│   ├── axiosInstance.ts
│   └── accounts/      # endpoints.ts + hooks.ts + index.ts
├── components/
│   ├── brutal/        # BrutalPage — home hero + marquee + spec sheet
│   ├── auth/          # AuthLayout, FormError, OAuthButtons
│   ├── bits/          # AccordionGallery, FlowingMenu, ScrollReveal (logic only)
│   ├── ui/            # shadcn + Radix (button, card, input, FadeImage, stack, torn-text)
│   └── theme/         # ThemeProvider
├── hooks/             # useDebounce, useIsMobile
├── lib/               # constants, seo, validators, color, smoothScroll, utils
├── pages/             # Home (thin) + auth/* (lazy)
├── store/auth/        # Zustand persist
└── test/              # axe, setup
```

```
PAGES ARE THIN — components receive props, never hooks directly.
```

---

### 04 — STACK

| LAYER     | CHOICE                                                                           |
| --------- | -------------------------------------------------------------------------------- |
| Framework | React 19 + TS 5 (strict)                                                         |
| Bundler   | Vite 7 + manualChunks (react / query / radix / gsap)                             |
| Styling   | Tailwind v4 + CSS vars + `border-[3px] border-black` + `shadow-[4px_4px_0_#000]` |
| State     | Zustand (persist) + TanStack Query 5                                             |
| HTTP      | Axios + interceptors + `extractErrorMessage`                                     |
| Router    | React Router 7 (lazy + `basename`)                                               |
| FX        | GSAP + Lenis (on demand, respects `prefers-reduced-motion`)                      |

Accent: `#8B5CF6` on `bg-white` / `bg-black` — brutal, high-contrast, WCAG AA.

---

### 05 — ROUTING

```tsx
// App.tsx — lazy, split, no bloat
const Home = lazy(() => import('@/pages/Home')) // BrutalPage → 17KB
const Login = lazy(() => import('@/pages/auth/Login'))
```

- Every route is a chunk. No heavy lib in critical path.

---

### 06 — QUALITY GATE

```bash
npm run check   # typecheck + lint + format:check + test
npm run typecheck
npm run lint
npm run format
npm run test        # Vitest + RTL + axe-core
npm run build       # → dist/
```

CI: `.github/workflows/ci.yml` — `npm ci` → typecheck → lint → format:check → test → build. Red = not mergeable.

---

### 07 — SECURITY

```
[ ] VITE_API_URL = prod
[ ] CORS = prod origin
[ ] HTTPS everywhere
[ ] No secrets in client
[ ] CSP headers
```

---

### 08 — DOCS

```
docs/
├── Performance.md   # LCP/INP/CLS/TBT, WebP 82, vendor split
├── SEO.md           # crawlability, meta, JSON-LD
├── Accessibility.md # skip-link, focus, axe
└── BestPractices.md # 3-file API, thin pages, CI
```

---

```
┌──────────────────────────────────────────────┐
│  © 2026 REACT RAPIDO — SHIP IT & FORGET IT  │
│  RAW  //  CLEAN  //  BRUTAL                  │
└──────────────────────────────────────────────┘
```

_Built for senior review. No emojis, no fluff._
