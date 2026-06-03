# Phase 3 — Baseline Audit

Scope: mobile baseline for Hero / Process / Projects / Services / Contact.
Artifacts: Lighthouse JSONs (per the `npm run qa:lighthouse` workflow) and screenshots in `../.opencode/screenshots/`.

**Per-route metrics (mobile)**
- `/` (root): **Perf:** 0.83 — FCP 772 ms — LCP 3665 ms — TBT 296 ms — Interactive 3823 ms — totalByteWeight 411,830 B
- `/projects`: **Perf:** 0.95 — FCP 763 ms — LCP 2263 ms — TBT 221 ms — Interactive 3440 ms — totalByteWeight 439,371 B
- `/projects/isp-platform`: **Perf:** 0.82 — FCP 1540 ms — LCP 4145 ms — TBT 235 ms — Interactive 4539 ms — totalByteWeight 580,121 B
- `/contact`: **Perf:** 0.93 — FCP 1061 ms — LCP 2558 ms — TBT 224 ms — Interactive 3763 ms — totalByteWeight 433,420 B
- `/services`: **Perf:** 0.93 — FCP 1065 ms — LCP 2560 ms — TBT 227 ms — Interactive 3592 ms — totalByteWeight 433,204 B

Sources: reports/lighthouse/2026-05-30/localhost_3000_*_mobile.json

**Top script-treemap findings (across routes)**
- `/_next/static/chunks/655-7a1746c768fa815f.js` — resourceBytes **406,927 B**, encoded **123,489 B**, unused **~260k B** (largest shared chunk)
- `/_next/static/chunks/9da6db1e-6bffc0140f1134b7.js` — resourceBytes **189,456 B**, encoded **61,837 B**, unused **~117k B**
- `/_next/static/chunks/4bd1b696-16eec3c199ae02a6.js` — resourceBytes **173,403 B**, encoded **54,558 B**, unused **~55k B**
- `/_next/static/chunks/841-f8e9dc9746a91961.js` — resourceBytes **153,715 B**, encoded **49,744 B**, unused **~85k B**
- Additional mid-size chunks: `313-*.js` (~33.8k), `876-*.js` (~36.4k), `app/page-*.js` and route-specific chunks (~12–36k)

Interpretation: a single large shared chunk (`655-...`) is dominant — high transfer + large unused bytes across routes, driving total byte weight and CPU parse/compile time. Several other shared chunks also contribute meaningful encoded/unused bytes.

**Ranked recommendations (practical, high ROI)**
1. Split or async-load the large shared chunk (`655-…`) — move non-essential code out into route-scoped dynamic imports or client-only lazy modules. Priority: Critical.
2. Convert shared utilities/components used by a subset of routes to dynamic imports (route-only bundles). Priority: High.
3. Audit and remove unused exports / reduce duplicate dependencies (unusedBytes high for multiple chunks). Use bundle analyzer / webpack/next build trace. Priority: High.
4. Defer or async non-critical JS (analytics, non-UI libs) and load them after TTI. Priority: Medium.
5. Review third-party libs: identify heavy libraries inside `655-…` and evaluate lightweight alternatives or partial imports. Priority: Medium.
6. Optimize font delivery and image sizes (preload critical fonts, ensure compressed WebP for hero images). Priority: Low–Medium.
7. Re-run Playwright sweep if any screenshots are placeholders (validate dev server before sweep). Priority: Quick win.

Quick wins: defer analytics, dynamic-import large UI widgets, audit and tree-shake heavy utility libs.

**Validated visual evidence (screenshots)**
All captured screenshots are in `../.opencode/screenshots/` — sample files:
- [../.opencode/screenshots/home-360x800.png](../.opencode/screenshots/home-360x800.png)
- [../.opencode/screenshots/projects-360x800.png](../.opencode/screenshots/projects-360x800.png)
- [../.opencode/screenshots/contact-360x800.png](../.opencode/screenshots/contact-360x800.png)
- [../.opencode/screenshots/services-360x800.png](../.opencode/screenshots/services-360x800.png)
- [../.opencode/screenshots/about-360x800.png](../.opencode/screenshots/about-360x800.png)

Directory (full set): [../.opencode/screenshots](../.opencode/screenshots)

**Next steps (recommend executing in order)**
- Validate the full screenshot set (target: 60 images). If placeholders found, re-run: `node scripts/mobile-sweep.js --url http://localhost:3000`.
- Run a targeted bundle-analysis pass: `next build && npx @next/bundle-analyzer` (or existing treemap parsing) to create a per-chunk module map.
- Implement a focused split for `655-…`: identify large modules inside it, convert them to dynamic imports, measure delta in Lighthouse.
- Implement deferred loading for analytics + non-critical scripts, re-run mobile sweep + Lighthouse, and iterate.

If you want, I can now:
- assemble a CSV of per-route metrics and top-5 chunks per route,
- or start a targeted PR that converts the highest-ROI module(s) inside `655-…` to `dynamic()` imports.

Report generated from Lighthouse JSONs and screenshots in `../.opencode/screenshots/`.
