# Performance — World-Grade Playbook

> **Scope:** Applies to **any** website (static, SPA, SSR, SSG, e-commerce, portfolio, docs). Framework-agnostic unless a note says otherwise.
> **Goal:** green Core Web Vitals on real devices, not just on a fast laptop.
> **Sources of truth:** [web.dev Vitals](https://web.dev/vitals/), [LCP](https://web.dev/articles/lcp), [INP](https://web.dev/articles/inp), [CLS](https://web.dev/articles/cls), [TBT](https://web.dev/articles/tbt), [Learn Performance](https://web.dev/learn/performance), [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance).

---

## 1. The metrics that decide the score

These are the field metrics Google and Lighthouse use. Optimize for **field** data (real users), verify with **lab** tools.

| Metric                              | Measures                                   | Good     | Needs work | Bad      |
| ----------------------------------- | ------------------------------------------ | -------- | ---------- | -------- |
| **LCP** (Largest Contentful Paint)  | Loading — when the main content is visible | ≤ 2.5 s  | 2.5–4.0 s  | > 4.0 s  |
| **INP** (Interaction to Next Paint) | Interactivity — responsiveness to input    | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift)   | Visual stability                           | ≤ 0.1    | 0.1–0.25   | > 0.25   |
| **TBT** (Total Blocking Time)       | Main-thread blocking (lab proxy for INP)   | ≤ 200 ms | 200–600 ms | > 600 ms |
| **Speed Index**                     | How quickly content is visually complete   | ≤ 3.4 s  | 3.4–5.8 s  | > 5.8 s  |

> **Standardized measurement loop:** Lighthouse (lab) for regressions in CI + CrUX / RUM (field) for reality. Never tune to Lighthouse alone — a dev build lies. See [Chrome UX Report](https://developer.chrome.com/docs/crux).

---

## 2. LCP — make the biggest element arrive instantly

The LCP element is usually a hero image, a headline, or a video poster. Your job: make _that one element_ load first.

### 2.1 Ship modern image formats — never PNG/JPEG on the critical path

| Format   | Use for                                  | Notes                                                                                             |
| -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **AVIF** | Photos, complex images                   | Best compression; ~50% smaller than JPEG. Check browser support (all modern browsers since 2022). |
| **WebP** | Photos, illustrations                    | Broad support, solid compression. Safe default.                                                   |
| **SVG**  | Icons, logos, line art                   | Vector, tiny, crisp. No raster needed.                                                            |
| **PNG**  | Transparency where WebP/AVIF unsupported | Use only when required; compress with `pngquant`.                                                 |

> **Standardized:** for photographic content use **AVIF with a WebP fallback**; for icons/logos use **SVG**. PNG is the exception, not the default.

### 2.2 Give the LCP image explicit dimensions (no CLS)

Every image needs `width` + `height` **or** a fixed aspect-ratio container (`aspect-ratio`, `aspect-square`, `aspect-video`). This reserves space before the image loads.

```html
<img src="hero.avif" width="1600" height="900" alt="..." fetchpriority="high" />
<!-- or responsive -->
<img
  src="hero.avif"
  srcset="hero-480.avif 480w, hero-1600.avif 1600w"
  sizes="(max-width: 768px) 100vw, 1600px"
  alt="..."
  fetchpriority="high"
/>
```

### 2.3 Prioritize the LCP resource

- `fetchpriority="high"` on the LCP image.
- `loading="eager"` + `decoding="async"` (do **not** lazy-load the LCP element).
- If the LCP image is referenced via CSS or JS (not a static `<img>`), add `<link rel="preload" as="image" href="hero.avif" fetchpriority="high">` in `<head>`.

### 2.4 No render-blocking resources in the critical path

- CSS: inline critical CSS; load the rest with `media="print" onload="this.media='all'"` or `preload` + `onload`.
- JS: `defer` (or `async` for independent scripts). Never a synchronous `<script>` in `<head>` that blocks parsing.
- Fonts: load non-render-blocking (see §5).

---

## 3. JavaScript — the #1 enemy of TBT / INP

JS is the most common cause of failed mobile scores. Every KB of JS is parsed, compiled, and executed on the **user's** CPU.

### 3.1 Route-level code splitting (baseline)

Split per route so the initial bundle only contains what the first screen needs. (React: `React.lazy` + `Suspense`; Vue: async routes; Svelte: dynamic imports; Next.js/Nuxt: file-based splitting is automatic.)

### 3.2 Vendor splitting via `manualChunks`

Separate stable vendor libs (framework, router, state) from app code so they cache independently and don't re-download on every app change.

### 3.3 Eager vs Lazy loading of below-the-fold content

This is the decision most teams get wrong.

- **Situation A — strict performance budget, heavy below-fold widgets (WebGL, data-grids, charts, 3D):** Defer loading and initialization of below-fold sections until they are near the viewport. This keeps initial TBT low. Trade-off: content is not in the DOM at first paint, so you must reserve space and reveal it smoothly (fade/slide), otherwise it "pops."
- **Situation B — simple content, or you want the whole page present immediately and accept a heavier initial load:** Load everything eagerly, and cover the heavier load with a branded loading screen that hides only after `window.load`. Trade-off: larger initial JS/CSS → higher TBT on slow devices, but zero scroll-time surprises and simplest mental model.

**When to use each:**

- Use **A** when a Lighthouse/field-performance budget is a hard requirement (most production marketing/commerce sites).
- Use **B** when the experience must be perfectly smooth with zero conditional loading, and you can hide the cost behind a full-page loader (internal tools, portfolios where the owner accepts a lower score).

> **Standardized:** Default to **A (defer below-fold heavy content)** for public, performance-sensitive sites. Reveal deferred content with a reserved-height container + CSS fade so it never pops. Reserve **B** for cases where a full loader is acceptable and smoothness-without-surprise is the priority. Regardless of choice, **always reserve layout space** for deferred content to keep CLS at 0.

### 3.4 Break up long tasks

Any single JS task > 50 ms blocks the main thread (counts toward TBT, hurts INP). Split with `setTimeout(…, 0)`, `requestIdleCallback`, or scheduling APIs. Yield to the browser between chunks of work.

### 3.5 Keep WebGL / three.js / heavy canvas off the critical path

WebGL contexts are expensive. Load them lazily, cap devicePixelRatio (e.g. `min(dpr, 1.5)`), pause rendering when off-screen (`IntersectionObserver`) or when the tab is hidden (`visibilitychange`), and freeze for `prefers-reduced-motion`.

### 3.6 Smooth scrolling without jank

- Animate only `transform` and `opacity` (GPU-composited). Never animate `top/left/width/height/margin` in hot paths.
- Use `will-change` sparingly and remove it after the animation (permanent `will-change` on many elements destroys performance).
- Respect `prefers-reduced-motion`: collapse animations to ~0.
- Debounce/throttle scroll, resize, and input handlers.

---

## 4. Images — fade in, never shift

- Use `loading="lazy"` + `decoding="async"` for **all non-LCP** images (below the fold).
- Always set explicit dimensions or aspect-ratio containers → CLS = 0.
- Serve responsive images with `srcset` + `sizes`.
- Use a low-quality placeholder / blur-up or a simple opacity fade-in so loads feel intentional, not broken.
- Compress aggressively; aim for the smallest acceptable quality (AVIF/WebP at ~70–82 quality).

---

## 5. Fonts — fast and never shift

- Use `font-display: swap` (or `optional`) — never block render on fonts.
- Preconnect to the font origin (`<link rel="preconnect" crossorigin>`).
- Load non-render-blocking: `media="print" onload="this.media='all'"` + `<noscript>` fallback.
- Subset fonts (only ship glyphs you use); use `size-adjust` / `fallback` metrics to avoid layout shift when the web font swaps in.
- Avoid more than 2–3 font families / weights; each is a network + parse cost.

---

## 6. Animations — GPU only, respect the user

- Animate `transform` and `opacity` only.
- Honor `prefers-reduced-motion: reduce` globally (set `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` under the media query).
- Keep entrance animations subtle and short (< 600 ms).
- Never animate layout properties in scroll-driven effects; use `transform` with `will-change` scoped to the animation.

---

## 7. Measure like a pro

| Tool                                                       | Type  | Use                                            |
| ---------------------------------------------------------- | ----- | ---------------------------------------------- |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse) | Lab   | CI regressions, per-commit budgets             |
| [Chrome UX Report](https://developer.chrome.com/docs/crux) | Field | Real-user Core Web Vitals                      |
| [WebPageTest](https://www.webpagetest.org/)                | Lab   | Deep waterfalls, TBT, filmstrips               |
| Chrome DevTools                                            | Both  | Flame charts, layout-shift regions, long tasks |

> **Standardized:** Run Lighthouse in **CI on a throttled mobile profile** (e.g., Fast 4G + 4× CPU) with a **performance budget** that fails the build on regression. Pair with field data (CrUX/RUM) for the truth.

---

## 8. Pre-merge performance checklist

- [ ] LCP ≤ 2.5 s (mobile, throttled)
- [ ] CLS ≤ 0.1 (zero layout shift from images/fonts/ads/injected content)
- [ ] TBT ≤ 200 ms (mobile, throttled)
- [ ] INP ≤ 200 ms (field)
- [ ] LCP image: AVIF/WebP, explicit dimensions, `fetchpriority="high"`, not lazy
- [ ] All other images: `loading="lazy"` + `decoding="async"` + dimensions
- [ ] JS code-split per route; vendors split; no heavy lib in critical path
- [ ] Below-fold heavy content deferred (or full loader chosen) — space reserved either way
- [ ] `prefers-reduced-motion` honored
- [ ] Fonts non-render-blocking, `font-display: swap`, subset
- [ ] No render-blocking CSS/JS in `<head>`
- [ ] Lighthouse CI budget enforced; field data (CrUX/RUM) reviewed

---

## References

- Core Web Vitals — https://web.dev/vitals/
- LCP — https://web.dev/articles/lcp · INP — https://web.dev/articles/inp · CLS — https://web.dev/articles/cls · TBT — https://web.dev/articles/tbt
- Learn Performance — https://web.dev/learn/performance
- MDN Web Performance — https://developer.mozilla.org/en-US/docs/Web/Performance
- Chrome UX Report — https://developer.chrome.com/docs/crux
- Lighthouse — https://developer.chrome.com/docs/lighthouse
