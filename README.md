# React Rapido V1.0

**A modern, scalable, and production-ready React project template.**

_Updated for React 19 • TypeScript • Tailwind v4_

---

## Table of Contents

- [React Rapido V1.0](#react-rapido)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Project Structure](#project-structure)
  - [Environment Configuration](#environment-configuration)
  - [Development Guide](#development-guide)
    - [Common Commands](#common-commands)
    - [Code Quality \& Formatting](#code-quality--formatting)
  - [Routing \& Lazy Loading](#routing--lazy-loading)
  - [Production Build](#production-build)
  - [Testing](#testing)
  - [Security Checklist](#security-checklist)

---

## Features

- **Core Framework**: React 19 & TypeScript
- **Bundler**: Vite 7+ with fast HMR and optimized builds
- **Styling**: Tailwind CSS v4 with CSS variables and dark mode
- **State Management**: Zustand for local state, React Query (TanStack Query) for server state
- **Routing**: React Router v7 with lazy-loaded routes and code splitting
- **HTTP Client**: Axios with interceptors for auth token handling
- **UI Components**: Radix UI primitives + shadcn styling with Framer Motion animations
- **Theming**: System-preference-aware dark/light mode with persistent toggle
- **Authentication**: JWT-based auth flow (login, register, password reset, OTP verification)
- **Icons**: Lucide React icon library
- **Code Quality**: TypeScript strict mode, ESLint

---

## Prerequisites

Before beginning, ensure the following are installed:

- **Node.js**: 20+
- **npm**: 10+

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url> my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Copy the environment variables template
cp .env.example .env

# 4. Start the development server
npm run dev
```

**Access URLs:**

- Application: `http://localhost:5173`

---

## Project Structure

```text
src/
├── api/                        # API layer
│   ├── axiosInstance.ts        # Axios instance with auth interceptors
│   └── hooks/                  # React Query hooks per domain
│       ├── authEndpoints.ts    # Auth API path constants
│       ├── useAuth.ts          # Authentication mutations
│       └── index.ts            # Barrel export
│
├── components/                 # Shared UI components
│   ├── auth/                   # Auth-specific (AuthLayout, FormDivider, OAuthButtons)
│   ├── layout/                 # Layout components (Navbar)
│   ├── theme/                  # Theme system (ThemeProvider, ModeToggle)
│   └── ui/                     # Generic primitives (button, card, badge, etc.)
│
├── hooks/                      # Shared React hooks
│   └── useMediaQuery.ts
│
├── lib/                        # Utilities & configuration
│   ├── constants.ts            # Environment variables & route paths
│   └── utils.ts                # Utility helpers (cn, etc.)
│
├── pages/                      # Route-level page components (lazy-loaded)
│   ├── Home.tsx
│   └── auth/                   # Auth pages (Login, Register, ForgotPassword, etc.)
│
├── store/                      # Zustand stores
│   └── auth/                   # Auth state (persisted)
│
├── App.tsx                     # Root component with route definitions
├── MainLayout.tsx              # Layout wrapper with Navbar + Outlet
└── index.css                   # Theme tokens, Tailwind imports, global styles

├── public/                     # Static assets
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── .env.example                # Baseline environment configuration
```

---

## Environment Configuration

Configuration is managed via environment variables prefixed with `VITE_`:

| Variable        | Description              | Default                        |
| --------------- | ------------------------ | ------------------------------ |
| `VITE_API_URL`  | Backend API base URL     | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Application display name | `React Rapido V1.0`            |

**Note:** Never commit the populated `.env` file to version control.

---

## Development Guide

### Common Commands

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start the Vite development server with HMR |
| `npm run build`   | Production build to `dist/`                |
| `npm run preview` | Preview the production build locally       |

### Code Quality & Formatting

Quality is enforced by tooling, not discipline. Run `npm run check` (typecheck + lint + format check + tests) before committing — the same gate runs in CI (`.github/workflows/ci.yml`) on every push/PR:

```bash
# One command: everything
npm run check

# TypeScript type checking
npm run typecheck

# Lint with ESLint (incl. import order, no non-null assertions, thin pages)
npm run lint

# Format with Prettier (also gated via `format:check`)
npm run format
```

| Command                | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `npm run check`        | typecheck + lint + format:check + test (CI-equivalent) |
| `npm run typecheck`    | `tsc -b --noEmit`                                      |
| `npm run lint`         | ESLint (flat config)                                   |
| `npm run format`       | Prettier write over the repo                           |
| `npm run format:check` | Prettier check (fails on drift)                        |

---

## Routing & Lazy Loading

All page components are lazy-loaded using `React.lazy()` + dynamic `import()` for automatic code splitting:

```tsx
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/auth/Login'))
```

Each route generates its own chunk during the build, keeping the initial bundle lean.

---

## Production Build

```bash
# Generate an optimized production bundle
npm run build

# The output lands in the dist/ directory, ready to deploy
# to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.)
```

For SPA hosting, configure your server to route all paths to `index.html` (e.g., a `_redirects` file for Netlify or a catch-all rewrite rule).

---

## Testing

The template ships with **Vitest + React Testing Library + jsdom + axe-core**:

```bash
npm run test        # Run once
npm run test:watch  # Watch mode
```

- Test infra lives in `src/test/`: `setup-env.ts` (sets `IS_REACT_ACT_ENVIRONMENT`), `setup.ts` (jest-dom matchers), `axe.ts` (axe-core runner).
- `a11y-*.test.tsx` runs axe scans on components to catch missing labels, contrast, and ARIA misuse.
- Keep the suite green and lint-clean before committing (see `AGENTS.md`).

---

## Security Checklist

When deploying the frontend to production, confirm the following:

- [ ] Ensure `VITE_API_URL` points to the production API endpoint.
- [ ] Verify CORS is configured on the backend to allow the production origin.
- [ ] Use HTTPS for both the frontend and API in production.
- [ ] Never store sensitive secrets (API keys, tokens) in client-side code.
- [ ] Ensure CSP headers are set on the hosting server.

---

**React Rapido V1.0** — Build faster, scale beautifully.
