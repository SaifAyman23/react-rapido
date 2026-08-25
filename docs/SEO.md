# SEO — World-Grade Playbook

> **Scope:** Applies to **any** website that wants to be found on search engines. Framework-agnostic.
> **Sources of truth:** [Google Search Central](https://developers.google.com/search/docs), [schema.org](https://schema.org/), [Rich Results Test](https://search.google.com/test/rich-results), [web.dev SEO](https://web.dev/learn/seo), [MDN SEO](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Metadata).

---

## 1. The technical foundation

- **HTTPS everywhere.** Secure context is a ranking signal and a requirement for many browser features.
- **Mobile-first.** Google indexes the mobile version first. The page must be usable and content-complete on mobile.
- **Valid, parseable HTML.** Correct `doctype`, `lang` attribute, `meta charset`, no broken tags. Use the [Rich Results Test](https://search.google.com/test/rich-results) and the [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly).
- **robots.txt + XML sitemap.** Allow crawling; point to your sitemap. Generate the sitemap at build time so it never goes stale.
- **Canonical URL.** One canonical per page; use `rel="canonical"` to consolidate duplicates.

---

## 2. Crawlability — make content reachable

Search engines render JavaScript, but **do not rely on it**. The safest path is server-rendered or pre-rendered HTML.

### 2.1 CSR vs SSR/SSG for crawlability

- **Situation A — Single-Page App (client-rendered):** Content is injected by JS. Google _can_ render it, but it's slower, uses more crawl budget, and risks key content being missed if JS fails. Requires extra care (prerender or dynamic rendering) to be safe.
- **Situation B — Server-Side Rendered / Static (SSR/SSG):** HTML arrives complete. Crawlers and users get content immediately. Best for SEO and Core Web Vitals.

**When to use each:**

- Use **B** for marketing, content, e-commerce, and any page that must rank. This is the recommendation for the vast majority of sites.
- Use **A** only when the app is behind auth, highly interactive, or when paired with prerendering/SSR hydration (modern meta-frameworks do this automatically).

> **Standardized:** Render primary content **server-side or at build time**. If you must ship a CSR SPA, add prerendering (or an SSR/hybrid framework) so crawlers receive full HTML. Never hide indexable content behind JS-only rendering with no fallback.

### 2.2 Internal linking & crawl structure

- Every important page reachable via a plain `<a href>` link (crawlers follow links, not click handlers).
- Logical hierarchy; breadcrumbs with structured data.
- Avoid orphan pages; submit the sitemap.

---

## 3. Per-route meta (SPA-safe)

Each URL needs unique, accurate meta. How you set it depends on rendering:

- **SSR/SSG / static:** emit `<title>`, `<meta name="description">`, canonical, OG, and Twitter tags **server-side per route**.
- **Client-rendered SPA:** update them on route change (e.g., a `SeoUpdater` that writes `document.title` and upserts meta/OG/canonical tags via JS). Must run before paint to avoid flashes, and must also work for crawlers (hence prefer the SSR route).

Meta essentials per page:

- `<title>` — unique, descriptive, ≤ ~60 chars, primary keyword first.
- `<meta name="description">` — unique, compelling, ≤ ~155 chars.
- `<link rel="canonical">` — absolute canonical URL.
- Open Graph + Twitter (see §4).

> **Standardized:** Unique title + description + canonical **per route**, present in the served HTML (not only injected after JS). OG/Twitter for social sharing.

---

## 4. Open Graph + Twitter cards

Social platforms read these; they don't affect Google ranking but drive click-through.

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:image" content="https://example.com/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://example.com/og.png" />
```

- Always provide `og:image` (1200×630 recommended) and `twitter:image`.
- Use `summary_large_image` for visual impact.

---

## 5. Structured data (JSON-LD)

Add machine-readable data so Google can show rich results (stars, FAQs, breadcrumbs, job posts, products). Use JSON-LD (preferred by Google) in the served HTML.

Common types: `Organization`, `WebSite`, `Article`, `Product`, `BreadcrumbList`, `FAQPage`, `Person`, `LocalBusiness`.

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Example Co",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png"
  }
</script>
```

- Validate with the [Rich Results Test](https://search.google.com/test/rich-results).
- Keep structured data consistent with visible content (never mark up content that isn't on the page).

---

## 6. Content & semantics that rank

- **Semantic HTML:** real `<header>/<nav>/<main>/<article>/<section>/<footer>`, correct heading order (`h1` once per page, logical `h2`→`h3`).
- **Helpful, original content:** answer the query; demonstrate Experience, Expertise, Authoritativeness, Trust (E-E-A-T).
- **Internal links** with descriptive anchor text.
- **Images:** meaningful `alt`; descriptive filenames; compressed.
- **URLs:** clean, readable, keyword-aware (`/blog/performance-budget` not `/p?id=48`).
- **Multilingual:** `hreflang` links between language/region variants; `x-default` fallback.

---

## 7. Performance is SEO

Core Web Vitals are a **ranking signal**. A slow site ranks lower and converts worse. Treat §Performance as part of SEO, not separate. See [web.dev SEO](https://web.dev/learn/seo) and [Search Central: page experience](https://developers.google.com/search/docs/appearance/page-experience).

---

## 8. Pre-merge SEO checklist

- [ ] HTTPS, mobile-first, valid HTML
- [ ] `robots.txt` allows crawling; XML sitemap submitted & current
- [ ] Canonical URL set per page
- [ ] Unique `<title>` + `<meta description>` per route (in served HTML)
- [ ] Primary content server-rendered / prerendered (not JS-only)
- [ ] OG + Twitter tags present and correct per page
- [ ] JSON-LD structured data validated (Rich Results Test)
- [ ] Semantic HTML, single `h1`, logical headings
- [ ] `hreflang` set for multilingual sites
- [ ] Internal links use real `<a href>`
- [ ] Core Web Vitals within "good" thresholds (see Performance)

---

## References

- Google Search Central — https://developers.google.com/search/docs
- SEO fundamentals (web.dev) — https://web.dev/learn/seo
- MDN SEO — https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Metadata
- Schema.org — https://schema.org/
- Rich Results Test — https://search.google.com/test/rich-results
- Page experience — https://developers.google.com/search/docs/appearance/page-experience
