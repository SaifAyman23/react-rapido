# Performance — World-Grade Playbook

> **Scope:** Applies to **any** website. Framework-agnostic unless a note says otherwise.
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

> **TBT is a window total:** deferring work to later _inside_ the measurement window moves _when_ it runs, not _how much_ runs — TBT only drops through elimination or sub-50ms splitting. Deferral still helps LCP/Speed Index (visual timing), which is why gating below-fold setup works: unviewed work never runs inside the window at all.

### 3.5 Keep WebGL / three.js / heavy canvas off the critical path

WebGL contexts are expensive. Load them lazily, cap devicePixelRatio (e.g. `min(dpr, 1.5)`), pause rendering when off-screen (`IntersectionObserver`) or when the tab is hidden (`visibilitychange`), and freeze for `prefers-reduced-motion`.

Two lab caveats: headless browsers without a GPU execute WebGL on the main thread in software — lab TBT for a GPU-heavy page can exceed real-device TBT by an order of magnitude, so never chase lab TBT on a GPU-less rig. And if the hero visual is a lazily-initialized canvas with no static poster, the viewport reads "incomplete" until it renders — Speed Index waits for it (see the poster trap in §8).

### 3.6 Smooth scrolling without jank

- Animate only `transform` and `opacity` (GPU-composited). Never animate `top/left/width/height/margin` in hot paths.
- Use `will-change` sparingly and remove it after the animation (permanent `will-change` on many elements destroys performance).
- Respect `prefers-reduced-motion`: collapse animations to ~0.
- Debounce/throttle scroll, resize, and input handlers.
- Serialize heavy section mounts during scroll: a fast scroll must never land several mount cascades (render + measure + observer wiring) on the same frames — stagger them so each hitch stays small.

### 3.7 Register animation plugins once, at startup

If anything in the initial bundle can create animations/triggers before lazy chunks evaluate, plugin registration must live in the app entry — not in the lazy chunks. Otherwise the first creation races the chunk load and throws against an unregistered plugin. Chunk-level registration is harmless to keep (idempotent).

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
- Self-host fonts instead of third-party font CDNs: one variable font file plus a `<link rel="preload">` removes DNS/TLS handshakes, extra stylesheets, and render-blocking chains entirely. Same pixels, zero third parties.
- Preconnect to the font origin (`<link rel="preconnect" crossorigin>`) — only needed while a remote origin remains.
- Load non-render-blocking: `media="print" onload="this.media='all'"` + `<noscript>` fallback.
- Subset fonts (only ship glyphs you use); use `size-adjust` / `fallback` metrics to avoid layout shift when the web font swaps in.
- Avoid more than 2–3 font families / weights; each is a network + parse cost.

---

## 6. Animations — GPU only, respect the user

- Animate `transform` and `opacity` only.
- Honor `prefers-reduced-motion: reduce` globally (set `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important` under the media query).
- Keep entrance animations subtle and short (< 600 ms).
- Cap ambient loops or accept their Speed Index cost: infinite viewport motion keeps the filmstrip changing and SI accumulates to the end of the trace.
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

## 8. Field notes — what actually moves the numbers

The items below earned their place by moving real measurements, ranked by typical effect size. Everything else in this file is theory until it does the same on your page.

| Change                                                        | Why it works                                                                                                                                                                                            | Typical effect                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Gate below-fold animation setup behind viewport proximity     | Scroll/animation libraries do their most expensive work at setup: DOM splitting, forced layout measurements, observer wiring. Running all of it inside the first commit creates one giant mount cascade | Often the single biggest TBT drop on animation-heavy pages (seconds, not milliseconds) |
| Modern formats + sources sized to display size                | Transfer weight dominates LCP and Speed Index on throttled networks. Oversized sources (e.g. 1900px file shown at 600px) waste the majority of their bytes                                              | Roughly proportional to bytes removed                                                  |
| No lazy boundary on the landing page itself                   | A lazy route/page adds a full round trip plus parse before _anything_ can paint, directly delaying LCP                                                                                                  | One round trip off the critical path                                                   |
| Heavy canvases (WebGL/WebGPU) behind idle + lazy chunks       | Their download, parse, GPU init, and shader compile land in one expensive burst                                                                                                                         | ~100–200ms TBT and up to ~0.5s LCP each, when measured by removal                      |
| Gate text measurement on the display face only                | Waiting on "all fonts ready" stalls entrances on unrelated font loads                                                                                                                                   | Removes unexplained entrance delays                                                    |
| Idle prefetch of below-fold chunks, staggered                 | Separates chunk parse cost from mount cost — but see the idle trap in §8                                                                                                                                | Small alone; enables the bigger wins                                                   |
| `loading="lazy"` + explicit dimensions on non-critical images | Fewer early requests, zero layout shift, clean Best-Practices audits                                                                                                                                    | Small individually, free in aggregate                                                  |

Smaller or unproven in practice: mobile-resize guards (correctness, rarely measurable), pin anticipation tweaks (feel, not lab numbers), `startTransition` on mount flags (no measurable delta found), chunk reshuffling past the obvious splits.

### Traps found here more than once

- **Idle callbacks all fire in the first idle gap.** Deferring five things to "idle" schedules them back-to-back in the same window. Stagger genuinely independent work (timeouts, separate idles) or it still sums into one long task.
- **`immediateRender` in scrubbed `fromTo` tweens** hides content at timeline creation, before the playhead arrives — panels start invisible on load. Set `immediateRender: false` on scrubbed entries unless hiding is the point.
- **Sub-pixel parking.** Sweep panels parked at exactly `100%` show a 1px sliver at fractional zooms (their edge lands exactly on the clip boundary). Park at `110%` instead.
- **Duplicate element IDs** break every selector-based animation silently (GSAP warns, keeps going, animates the wrong node or nothing).
- **Stale hot tabs lie.** After edits that only touch setup closures (`deps: []` never re-runs them), the browser keeps running pre-edit timelines. Hard-reload before trusting what you see.
- **Unregistered plugin races.** Register animation plugins in the app entry, not in lazy chunks, when anything in the main bundle can create triggers before those chunks evaluate — otherwise the first creation throws against an unregistered plugin.
- **No-poster canvas heroes.** If the hero visual is a lazily-initialized canvas, the viewport reads "incomplete" until it renders and Speed Index waits. Ship a static poster matching the final frame, or accept the SI cost explicitly.
- **Infinite viewport motion inflates Speed Index.** Ambient loops (word rolls, carousels, canvases) keep the filmstrip changing and SI accumulates to the end of the trace. Cap the cycles or accept it — FCP/LCP/TBT won't warn you.

### When a tight cluster still misleads

A 5-run median landing far from a previous median feels conclusive, but tight spreads only rule out _transient_ noise, not _sustained_ confounders. Before blaming code, exclude: dev-server rebuilds firing mid-measurement on every source edit, leaked headless browser processes competing for CPU, thermal throttling after long sessions, and general machine load. The protocol that settles it: quiet the rig (no dev server, no stray browsers, one cooldown run), then bisect single variables with back-to-back replicates on the same rig. And when a suspect is structural (e.g. "removing X added commits"), check the mechanism first — if no mechanism exists, suspect the rig, not the code. A stash-control build (pristine HEAD measured the same way) tells you whether the working tree helped or hurt overall, independent of any single suspect. A measured "best" that was never committed is unrecoverable — commit the tree with the number, or the number didn't happen.

---

## 9. Pre-merge performance checklist

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
