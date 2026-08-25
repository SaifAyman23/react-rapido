# Best Practices — World-Grade Playbook

> **Scope:** Engineering quality for **any** web project: what Lighthouse "Best Practices" checks, plus architecture, testing, CI, and security that keep a codebase healthy.
> **Sources of truth:** [Lighthouse Best Practices](https://developer.chrome.com/docs/lighthouse/best-practices/), [web.dev](https://web.dev/), [MDN](https://developer.mozilla.org/), [OWASP](https://owasp.org/).

---

## 1. Code health (what Lighthouse Best Practices checks)

Lighthouse's _Best Practices_ audit fails on concrete, detectable issues. Keep these clean:

- No browser console errors/warnings in the critical path.
- No use of deprecated APIs (e.g., `document.write`, deprecated `IntersectionObserver`/`Permissions` patterns).
- Correct `<!doctype html>`, `<meta charset>`, `<meta viewport>`.
- Images have correct aspect ratio (no distorted `<img>`).
- No mixed content (HTTP assets on HTTPS page).
- Valid, parseable HTML (no unclosed tags).
- Charset declared before any content.

---

## 2. Architecture — decoupled, single-responsibility

- **Separate concerns:** presentation (components) vs state/logic vs data access (API/service layer). A component should render and delegate, not own business rules.
- **Single responsibility:** one component = one UI concern. Extract repeated UI into reusable primitives.
- **Pages are thin:** fetch data, compose components, wire handlers. Keep logic in hooks/services.
- **Predictable structure:** group by domain/feature, with an `index.ts` barrel for stable imports.

> **Standardized:** Thin pages + reusable presentational components + a dedicated data/API layer. Components receive data and callbacks via props; they do not reach into global stores/routers/query hooks unless that is the explicit, documented pattern.

---

## 3. The data / API layer

A consistent pattern prevents scattered, inconsistent network code.

- **Endpoints module:** typed request/response interfaces + the actual calls (axios/fetch). Centralize base URLs and interceptors.
- **Hooks module:** data-fetching hooks (React Query / SWR / your equivalent) per action, with standardized error handling (no silent `catch {}`).
- **Types module:** shared request/response types.

> **Standardized three-file pattern** (adapt to your framework): `endpoints.ts` (calls + types) · `hooks.ts` (queries/mutations) · `index.ts` (barrel). Normalize errors into a single `extractErrorMessage` so the UI can surface them consistently.

Cross-cutting rules:

- Never commit secrets/keys to the client bundle. Use environment variables; keep server secrets server-side.
- Intercept responses to normalize errors; surface failures to the user — never fail silently.

---

## 4. Hooks & naming conventions

- Name hooks `use<Verb><Noun>` (`useLogin`, `useProjects`).
- Mutations surface errors via the standard handler.
- State ownership clarity: server data = cache (React Query/SWR); UI state = local `useState`; cross-cutting persistent state = a store (only when needed).
- Enforce import order and naming in CI (e.g., `eslint-plugin-import-x`).

---

## 5. Dependencies & supply chain

- **Minimize:** every dependency is code you must patch, audit, and ship. Prefer small, maintained libs.
- **Lockfiles:** commit `package-lock.json` / `pnpm-lock.yaml` for reproducible installs (`npm ci`).
- **Audit:** `npm audit` (or equivalent) in CI; fail on high/critical.
- **Stay current:** update deliberately; review changelogs for breaking changes.
- **Provenance:** prefer packages with active maintenance and clear ownership.

---

## 6. Testing — proof it works

| Layer              | What                         | Tooling examples                       |
| ------------------ | ---------------------------- | -------------------------------------- |
| Unit               | Pure functions, hooks, utils | Vitest, Jest, RTL                      |
| Component          | Render + interaction         | React Testing Library, Testing Library |
| Accessibility      | axe-core assertions          | jest-axe, vitest-axe                   |
| E2E                | Critical user flows          | Playwright, Cypress                    |
| Performance budget | Fail on regression           | Lighthouse CI                          |

> **Standardized:** Unit + component + a11y tests in CI on every PR. Add E2E for the critical path (login, checkout, submit). Enforce a performance budget. No code merges with failing tests.

---

## 7. CI gate (the enforcement point)

CI is where standards become real. A typical gate:

1. Install (reproducible: `npm ci`)
2. Type-check (`tsc --noEmit`)
3. Lint (`eslint .`)
4. Format check (`prettier --check .`)
5. Test (`vitest run`)
6. Build
7. Lighthouse / performance budget (mobile, throttled)
8. (Optional) Deploy preview for manual review

> **Standardized:** A red pipeline means the PR is not mergeable — period. Never rely on discipline alone; the bot enforces it.

---

## 8. Security hardening

- **HTTPS only**; HSTS; no mixed content.
- **No secrets in the client.** API keys that must be public (e.g., analytics) should be scoped; private keys stay server-side.
- **Content Security Policy (CSP):** restrict sources for scripts/styles/img/connect. Start strict, relax only with justification.
- **Sanitize user input** before rendering (HTML, URLs) to prevent XSS.
- **Subresource Integrity (SRI)** for third-party scripts when possible.
- **Dependency scanning** in CI ([OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/), `npm audit`).
- **HTTP security headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`.

> **Standardized:** HTTPS + CSP + input sanitization + dependency scanning are non-negotiable baselines for any production site. See [OWASP Top 10](https://owasp.org/www-project-top-ten/).

---

## 9. Maintainability

- **Conventions documented** (a `CONTRIBUTING` / `AGENTS.md` / README) so AI tools and humans follow the same rules.
- **Lint + format enforced** (Prettier + ESLint, gated in CI).
- **Small, reviewable PRs**; protected `main`; required reviews.
- **Meaningful commits**; clear PR descriptions.
- **Documentation** for non-obvious decisions; diagrams for architecture where helpful.

---

## 10. Pre-merge best-practices checklist

- [ ] No console errors; no deprecated APIs; valid HTML/doctype/charset
- [ ] No mixed content; images correct aspect ratio
- [ ] Architecture: thin pages, decoupled components, dedicated API layer
- [ ] API layer uses the standard 3-file pattern with normalized error handling
- [ ] No secrets in client code; env vars used correctly
- [ ] Dependencies audited; lockfile committed
- [ ] Tests pass (unit + component + a11y); E2E covers critical path
- [ ] CI gate green: typecheck, lint, format, test, build, perf budget
- [ ] CSP + sanitization + security headers present
- [ ] Conventions documented; PR small and reviewable

---

## References

- Lighthouse Best Practices — https://developer.chrome.com/docs/lighthouse/best-practices/
- web.dev — https://web.dev/
- MDN Web Docs — https://developer.mozilla.org/
- OWASP — https://owasp.org/ · OWASP Top 10 — https://owasp.org/www-project-top-ten/
- OWASP Dependency-Check — https://owasp.org/www-project-dependency-check/
