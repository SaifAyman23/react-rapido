# REACT RAPIDO

**Starter that stays out of your way. React 19 + TS 5 + Vite 7 + Tailwind v4.**

This is the starter I wish I had. No tutorial project. No demo fluff. Just a clean base that handles auth, routing, and performance so you can start building the real thing on day one.

| RR // 01 | REACT RAPIDO V1.0 2026 |
| -------- | ---------------------- |
| Build    | Faster                 |

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

`CLEAN` `FAST` `SOLID`

---

### TABLE OF CONTENTS

| #   | SECTION      |
| --- | ------------ |
| 01  | SPECS        |
| 02  | QUICK START  |
| 03  | STRUCTURE    |
| 04  | STACK        |
| 05  | ROUTING      |
| 06  | QUALITY GATE |
| 07  | SECURITY     |
| 08  | DOCS         |

---

### 01 SPECS

| Metric | Value                    | Status  |
| ------ | ------------------------ | ------- |
| LCP    | 2.5s                     | GOOD    |
| CLS    | 0.00                     | PERFECT |
| TBT    | 200ms                    | FAST    |
| AUTH   | JWT + OTP                | READY   |
| SEO    | per-route meta + sitemap | READY   |
| A11Y   | axe-core + focus ring    | PASS    |

If you blow the budget by 100KB, the build fails. On purpose.

---

### 02 QUICK START

```bash
# 01 clone
git clone https://github.com/SaifAyman23/react-rapido my-app
cd my-app

# 02 install
npm i

# 03 env
cp .env.example .env
# set VITE_API_URL, VITE_SITE_URL, VITE_APP_NAME

# 04 dev
npm run dev
# http://localhost:5173
```

| Command         | Time               |
| --------------- | ------------------ |
| `npm run dev`   | HMR 40ms           |
| `npm run check` | type/lint/fmt/test |

---

### 03 STRUCTURE

```
src/
├── api/               # 3-file pattern per domain
│   ├── axiosInstance.ts
│   └── accounts/      # endpoints.ts + hooks.ts + index.ts
├── components/
│   ├── landing/       # LandingPage with marquee and spec sheet
│   ├── auth/          # AuthLayout, FormError, OAuthButtons
│   ├── bits/          # AccordionGallery, FlowingMenu, ScrollReveal
│   ├── ui/            # shadcn + Radix (button, card, input, FadeImage, stack)
│   └── theme/         # ThemeProvider
├── hooks/             # useDebounce, useIsMobile
├── lib/               # constants, seo, validators, color, smoothScroll, utils
├── pages/             # Home (thin) + auth/* (lazy)
├── store/auth/        # Zustand persist
└── test/              # axe, setup
```

Pages stay thin. Components get props, not hooks. That is how it stays readable six months from now.

---

### 04 STACK

| LAYER     | CHOICE                                                    |
| --------- | --------------------------------------------------------- |
| Framework | React 19 + TS 5 strict                                    |
| Bundler   | Vite 7 + manualChunks (react / query / radix / gsap)      |
| Styling   | Tailwind v4 + CSS vars + `border-[3px] border-black`      |
| State     | Zustand persist + TanStack Query 5                        |
| HTTP      | Axios + interceptors + `extractErrorMessage`              |
| Router    | React Router 7 lazy + `basename`                          |
| FX        | GSAP + Lenis on demand, respects `prefers-reduced-motion` |

Accent `#8B5CF6` on `bg-white` and `bg-black`. High contrast, WCAG AA.

---

### 05 ROUTING

```tsx
// App.tsx, lazy and split. No bloat in the first chunk.
const Home = lazy(() => import('@/pages/Home')) // LandingPage 17KB
const Login = lazy(() => import('@/pages/auth/Login'))
```

Every route is its own chunk. Heavy libs never touch the first paint.

---

### 06 QUALITY GATE

```bash
npm run check   # typecheck + lint + format:check + test
npm run typecheck
npm run lint
npm run format
npm run test        # Vitest + RTL + axe-core
npm run build       # to dist/
```

CI runs the same gate on every push. `.github/workflows/ci.yml` does `npm ci` then typecheck, lint, format, test, build. Red means do not merge.

---

### 07 SECURITY

| Check                        | Status |
| ---------------------------- | ------ |
| VITE_API_URL points to prod  | [ ]    |
| CORS allows prod origin only | [ ]    |
| HTTPS everywhere             | [ ]    |
| No secrets in client bundle  | [ ]    |
| CSP headers set              | [ ]    |

---

### 08 DOCS

| File                    | Covers                                    |
| ----------------------- | ----------------------------------------- |
| `docs/Performance.md`   | LCP, INP, CLS, TBT, WebP 82, vendor split |
| `docs/SEO.md`           | crawlability, meta, JSON-LD               |
| `docs/Accessibility.md` | skip link, focus, axe                     |
| `docs/BestPractices.md` | 3-file API, thin pages, CI                |

---

| © 2026 REACT RAPIDO   | SHIP IT |
| --------------------- | ------- |
| RAW // CLEAN // SOLID | MIT     |

_Built to be forked. Make it yours._
