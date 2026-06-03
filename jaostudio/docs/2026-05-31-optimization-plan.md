# Optimization Plan — JAOstudio
Date: 2026-05-31

## Summary

- Context: Performance, accessibility and security audits were run against https://jaostudio.vercel.app/ and local previews. Artifacts are in `reports/`. Changes live on branch `fix/perf-accessibility` (pushed).
- Latest Lighthouse (mobile) snapshot: `reports/lighthouse/2026-05-30/jaostudio.vercel.app__mobile.json`.
  - FCP ≈ 1.4s
  - LCP ≈ 3.6s
  - TBT ≈ 110 ms
  - CLS = 0

## SEOptimer audit (30 May 2026)

- Report: https://www.seoptimer.com/jaostudio.vercel.app — Grade: B (18 recommendations).
- Category summary: On-Page SEO: A-; Links: F; Usability: A; Performance: A+.
- Key findings and implications:
   - Titles & meta descriptions: several pages should have unique, descriptive titles and meta descriptions; ensure length and keyword inclusion.
   - Canonical / Sitemap / Robots: SEOptimer recommends verifying canonical tags and providing a `sitemap.xml` and `robots.txt` so crawlers can index pages reliably.
   - Structured data: missing JSON-LD for `Organization`/`WebSite`/`BreadcrumbList` and project-level `CreativeWork` — add server-rendered schema so search engines can surface rich results.
   - Social meta (Open Graph / Twitter): OG/Twitter card tags are incomplete or missing for some pages; add `og:title`, `og:description`, `og:image`, `twitter:card` and `twitter:image:alt`.
   - Images & alt text: some images lack descriptive `alt` attributes; ensure `alt` and modern formats (WebP/AVIF) via `next/image`.
   - Internal links & backlinks: SEOptimer flagged Links as `F` — indicates weak internal linking and/or backlink profile. Internal linking is actionable in-code; backlinks require outreach.
   - Technical headers: ensure production responses do not include `x-robots-tag: noindex` and canonical headers are correct; preview/noindex behavior must remain separate.

- Mapped actions (code + process):
   - Add canonical link tags per page and ensure production canonical points to the public domain.
   - Generate `sitemap.xml` and ensure `robots.txt` references it; submit to Search Console.
   - Add base JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`) in the server-rendered layout and add `CreativeWork` schema on project pages.
   - Add/standardize Open Graph and Twitter meta in page metadata.
   - Audit images for missing `alt` attributes and convert to `next/image` where appropriate; preload hero LCP image.
   - Improve internal linking from index/home to project pages with descriptive anchor text.
   - Verify production headers (no `x-robots-tag: noindex`) and correct redirects/canonicalization.

- Quick wins (high impact, low effort):
   1. Standardize `title` and `meta description` across pages (use `metadata` in `src/app` where possible).
   2. Add `sitemap.xml` + `robots.txt` (automate generation with `next-sitemap` or a small server endpoint).
   3. Add basic JSON-LD `Organization` + `WebSite` in the homepage/layout.
   4. Add Open Graph/Twitter meta tags and a shared `og:image` (1200×630) for pages without custom social images.
   5. Preload the hero LCP image and ensure it uses `next/image` with `priority`.

Note: SEOptimer's `Links: F` is partially a content/outreach signal (backlinks) — we should fix in-code internal linking and schedule outreach to improve external links.

## Quick wins already implemented

- Lazy-load monitoring and analytics: Sentry/PostHog lazy initialization and `client-providers` wrapper (`src/components/layout/client-providers.tsx`).
- Converted heavy interactive NodeGraph to client-only dynamic import with loading placeholder: `src/components/sections/hero/hero.tsx`.
- Added font preload links in `src/app/layout.tsx` for the two primary woff2 files.
- Adjusted color tokens to improve contrast: `src/styles/tokens.css` and changed default badge text in `src/components/typography/badge.tsx`.
- Introduced `src/components/layout/below-fold.tsx` to dynamically import below-the-fold sections, lowering initial client bundle.
- Adjusted CSP application logic in `next.config.ts` (applies strict CSP to production only, previews relaxed while we iterate).

## Remaining opportunities (prioritized)

1) LCP remediation (highest ROI)
   - Identify exact LCP element using the Lighthouse JSON: `reports/lighthouse/2026-05-30/jaostudio.vercel.app__mobile.json`.
   - Fix patterns depending on node type:
     - Image: serve via `next/image` with `priority` or add `<link rel="preload" as="image" href="...">`.
     - Text with webfont: ensure the font is preloaded and tune `font-display` (consider FOFT to avoid invisible text)
   - Estimated impact: 200–1200 ms LCP reduction.

2) Reduce main-thread JS and split heavy chunks
   - Inspect analyzer: run `ANALYZE=true ANALYZE_TARGET=browser next build` and open `.next/analyze/client.html`.
   - Target large chunks (noted in current Lighthouse bootup diagnostics): `_next/static/chunks/255-*.js`, `841-*.js`, `328-*.js`, `4bd1b696-*.js`.
   - Convert non-critical modules to dynamic imports or idle-init. Re-run bundle analyzer and Lighthouse.
   - Estimated impact: 100–800 ms on LCP/TBT depending on split.

3) Ensure server-rendered hero / SSR placeholders
   - Ensure any visual LCP candidate is painted from SSR markup or an inlined placeholder (images/blocks must have reserved space).

4) Fonts & critical CSS
   - Keep two woff2 preloads; consider preconnect if fonts are cross-origin.
   - Consider inlining a tiny critical CSS for hero styles to reduce style recalculation.

5) Accessibility (color-contrast)
   - Parse `reports/accessibility/2026-05-30/axe-*.json` and produce actionable list; patch `src/styles/tokens.css` and small components (badges, labels).

6) CSP hardening (long-term)
   - Migrate away from `'unsafe-inline'` / `'unsafe-eval'` by implementing per-request nonces or adding hashes for build-time inline scripts.
   - Implement middleware to generate nonce and inject into `Content-Security-Policy` header and inline elements.

## Validation & CI

- Build/analyze: `ANALYZE=true npm run analyze:browser` (analyzer output in `.next/analyze/`).
- Lighthouse: `npm run qa:lighthouse -- --url "<url>" --mobile` (reports saved to `reports/lighthouse/<date>/`).
- Axe: `node ./scripts/axe.js "<url>"` (reports saved to `reports/accessibility/<date>/`).

## Immediate action plan (next sprint)

### Option A — LCP fix (recommended immediate)
- Detect LCP node, implement preload or `next/image` `priority`, or SSR placeholder. Deploy preview and re-run Lighthouse.
- ETA: 2–4 hours.

### Option B — JS splitting (deeper)
- Analyze biggest client chunks, convert top offenders to dynamic import/idle-init. Validate bundle size and run Lighthouse.
- ETA: 1–2 days.

### Option C — Accessibility fixes
- Auto-parse axe reports and patch contrast tokens & components (`src/components/typography/badge.tsx`, project cards, etc.). Re-run axe.
- ETA: 1–2 hours.

### Option D — CSP hardening (planning + rollout)
- Design nonce/hashing approach, implement middleware, migrate small inline scripts to use nonce/hash.
- ETA: 1–2 days (planning + initial rollout + verification).

## Owners & risks

- Owner (review): JAOstudio (Jameson) — visual/UX approval.
- Owner (implement): optimization team / me.
- Risks:
  - Over-lazy-loading interactive features harms UX — use progressive hydration patterns.
  - CSP migration requires careful staged rollout and testing to avoid site breakage.

## Deliverables & PRs

- Branch currently with quick fixes: `fix/perf-accessibility` (contains font preloads, below-fold dynamic wrapper, badge contrast token updates, and CSP iteration).
- For every major change we will open a focused PR with: description, before/after Lighthouse artifacts (in `reports/`), and analyzer screenshots (`.next/analyze/client.html`).

---

If you approve, reply with which immediate action to run: `Option A` (LCP fix), `Option B` (JS split), `Option C` (Accessibility fixes), or `Option D` (CSP migration). I will implement the change, create a PR, and re-run Lighthouse + axe and attach the results.
