# Accessibility — World-Grade Playbook

> **Scope:** Applies to **any** website. Framework-agnostic. Accessibility is a requirement, not a nice-to-have.
> **Sources of truth:** [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/), [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), [web.dev Accessibility](https://web.dev/learn/accessibility), [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility).

---

## 1. Structural accessibility (must-haves)

### 1.1 Skip link

First focusable element: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`, with `<main id="main-content" tabindex="-1">`.

### 1.2 Landmarks & semantic HTML

Use real elements: `<header> <nav> <main> <article> <section> <aside> <footer>`. Never fake a button with `<div onClick>` — use `<button>`. Screen readers navigate by landmark.

### 1.3 Visible focus

Every keyboard-focused element needs a clear `:focus-visible` outline. Never remove focus styles without a replacement.

```css
:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```

### 1.4 Heading order

One `<h1>` per page; never skip levels (`h1` → `h2` → `h3`). Headings describe structure, not size.

---

## 2. Motion & vestibular safety

- Honor `prefers-reduced-motion: reduce`. Under it, disable non-essential animation/transition (set durations to ~0).
- Don't auto-play scrolling/parallax that induces vertigo. Provide pause/stop controls for any auto-moving content.
- Keep motion purposeful and short.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. Keyboard & focus management

- **All functionality available via keyboard.** No mouse-only interactions.
- **Logical focus order** that follows visual order.
- **Modals/dialogs:** move focus into the dialog on open, trap focus inside, restore focus to the trigger on close, and dismiss on `Esc`. Prefer native `<dialog>` or a vetted library (Radix, Headless UI) over hand-rolled focus traps.
- **Single-page apps:** update focus on route change (move focus to the new page's `<h1>` or `main`) so screen-reader users aren't stranded.

---

## 4. Images, media & text alternatives

### 4.1 Alt text — informative vs decorative

- **Informative image:** `alt` describes the content/purpose.
- **Decorative image:** `alt=""` (intentionally empty) so AT ignores it.
- Never omit `alt` — an empty string is correct for decoration; a missing attribute is a failure.

### 4.2 SVG & media

- Inline SVG that conveys meaning needs `<title>` + `aria-labelledby`, or `role="img"` + `aria-label`.
- Video: provide captions (`<track kind="captions">`). Audio: provide a transcript.
- `prefers-reduced-motion`-style care: don't autoplay media with sound.

---

## 5. Forms & errors

- Every control has a visible `<label>` (or `aria-label`).
- Group radios/checkboxes with `<fieldset>` + `<legend>`.
- Errors are announced: associate with `aria-describedby` and use `role="alert"` (or `aria-live`) for dynamically shown errors.
- Don't rely on color alone to signal state (error vs success).

---

## 6. Color & contrast

- **WCAG 2.1 AA:** text contrast ≥ 4.5:1 (≥ 3:1 for large text ≥ 24px or ≥ 18.66px bold).
- Non-text UI components (icons, borders conveying state) ≥ 3:1 against adjacent colors.
- Never convey meaning by color alone — add text, icon, or pattern.
- Support `forced-colors` / Windows High Contrast mode; don't hard-code colors that break it.

---

## 7. ARIA — use native first

- **Situation A — a native HTML element/attribute does the job:** use it (`<button>`, `<nav>`, `<label>`, `<table>`, `disabled`, `required`). Native semantics are correct, keyboard-accessible, and free.
- **Situation B — you need a widget HTML can't express** (custom combobox, slider, tree): add ARIA roles/states/properties per the [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), and manage focus yourself.

**When to use each:**

- Default to **A**. Most UI is expressible in native HTML.
- Reach for **B** only when no native equivalent exists, and follow the APG pattern exactly.

> **Standardized:** **Prefer native HTML semantics over ARIA.** Rule of ARIA: "If you can use a native HTML element with the semantics and behavior you need, do it." ARIA is a last resort, not a first tool.

---

## 8. Automated a11y enforcement (the safety net)

Automated tests catch ~30–50% of issues. Combine tools:

| Tool                                                                                 | Use                                                      |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [axe-core](https://github.com/dequelabs/axe-core)                                    | Unit/integration a11y assertions                         |
| [Lighthouse a11y audit](https://developer.chrome.com/docs/lighthouse/accessibility/) | CI score                                                 |
| [pa11y](https://pa11y.org/)                                                          | Scripted page audits                                     |
| Manual + assistive tech                                                              | Real screen-reader testing (NVDA/VoiceOver) for the rest |

> **Standardized:** Run axe-core in the test suite and Lighthouse a11y in CI on every PR. Treat serious violations as build failures. Pair with periodic manual screen-reader testing.

---

## 9. Pre-merge accessibility checklist

- [ ] Skip link present; `<main>` has `id` + `tabindex="-1"`
- [ ] Semantic landmarks; single `h1`; no skipped heading levels
- [ ] Visible `:focus-visible` on all interactive elements
- [ ] Full keyboard operability; no mouse-only paths
- [ ] Modals trap + restore focus; Esc closes
- [ ] `alt` on every image (empty string for decorative)
- [ ] Video captions; audio transcripts
- [ ] Labels on all form controls; errors announced via `aria-describedby`/`role="alert"`
- [ ] Contrast ≥ 4.5:1 (text), ≥ 3:1 (UI); not color-only
- [ ] `prefers-reduced-motion` honored
- [ ] Native HTML used before ARIA
- [ ] axe-core + Lighthouse a11y green in CI

---

## References

- WCAG 2.1 Quick Reference — https://www.w3.org/WAI/WCAG21/quickref/
- WAI-ARIA Authoring Practices — https://www.w3.org/WAI/ARIA/apg/
- web.dev Accessibility — https://web.dev/learn/accessibility
- MDN Accessibility — https://developer.mozilla.org/en-US/docs/Web/Accessibility
- Lighthouse accessibility — https://developer.chrome.com/docs/lighthouse/accessibility/
- axe-core — https://github.com/dequelabs/axe-core
