# Performance Budget

## Threshold Policy

- **Warn** — CI prints a warning, does not fail.
- **Fail** — CI exits non-zero, blocks the pipeline.
- **Enforced routes only**: shared JS, homepage, project detail. Secondary marketing routes (`/services`, `/contact`) warn only — no hard failure.

Exact thresholds are defined in `config/performance-budget.ts`. Current values:

| Metric                    | Baseline | Warn     | Fail     |
| ------------------------- | -------- | -------- | -------- |
| Shared first-load JS      | 102 kB   | 120 kB   | 132 kB   |
| Homepage (First Load JS)  | 241 kB   | 265 kB   | 290 kB   |
| Project detail (First Load JS) | 225 kB | 248 kB | 270 kB   |

### Release-Gate Bundle Budget (separate from CI warn/fail)

A second, stricter set of thresholds lives in `docs/release-gates.md:16`
for the production release pipeline. It is intentionally distinct from
the CI warn/fail table above so the two can be tuned independently: CI
fails fast on regressions, while the release gate keeps a tighter cap
on what ships. Do not reconcile the two — they serve different
purposes (CI regression guard vs. release size contract).

## How to Run the Analyzer

```bash
# Generate interactive treemaps in .next/analyze/
npm run analyze

# Browser-specific bundles only
npm run analyze:browser

# Server-specific bundles only
npm run analyze:server
```

Output is written to `.next/analyze/client.html` and `.next/analyze/server.html`. Open these in a browser to inspect chunk composition.

## How to Run the Budget Check

```bash
node scripts/check-budget.js
```

This runs a full `next build`, parses the output, and compares against thresholds defined in `config/performance-budget.ts`.

## What Constitutes a Regression

Any change that increases bundle size beyond the tolerances above. Common culprits:

- Adding a new dependency without verifying tree-shakeability
- Importing from the wrong entry point (e.g., `framer-motion` barrel vs named)
- Adding large inline SVGs or base64-encoded assets
- Unintentional duplication from utils/layout components
- Adding new pages with heavy section components

## Lighthouse Baseline Tracking

Record Lighthouse scores after each production deploy in `reports/lighthouse/`:

```bash
npm run qa:lighthouse -- --url https://your-domain.com
```

This produces timestamped JSON and HTML reports. Review the diff from the previous baseline before approving the deploy.

## Allowed Window

- **Warning zone**: between warn and fail thresholds — acceptable with documented justification
- **Failure zone**: above fail threshold — must be resolved before deploy

## Budget Config Source

Thresholds live in `config/performance-budget.ts` — single source of truth for both docs and CI.

## TBT Attribution (Step 5 outcome, 2026-06-02)

Lighthouse 13.3.0 reported homepage TBT in the 220–270ms band on the
Vercel preview (across `/` and `/tl`, mobile + desktop). The 150ms
internal gate was missed on the upper end. Step 5 was a three-phase
attribution effort to find the cause before any architectural change.

### Phase 1 — BelowFold (per-section)

Wrapped each BelowFold `dynamic()` import with a `profiledImport()`
helper that recorded a `bf:<section>` performance measure. Run via
`e2e/tbt-profile.spec.ts`.

```
/   featured-projects  31.5 ms
    capabilities       15.1 ms
    process            21.6 ms
    tech-credibility   16.9 ms
    social-proof       15.2 ms
    contact            16.5 ms
    SUM                116.8 ms  (≈53% of TBT)
/tl SUM               132.2 ms  (≈53% of TBT)
```

Conclusion: BelowFold sections together account for **~117ms (53%) of
total TBT**. No single section dominates; the largest is
featured-projects at 31.5ms.

### Phase 2A — AboveFold (in-component useEffect markers, FAILED)

Added `perfStart()` + `usePerfMount()` to 5 AboveFold components
(Hero, Navbar, LenisProvider, SystemProvider, ScrollDepthTracker).
All 5 measured **the same 80–160ms "first render → first useEffect"
gap**, which is misleading: they share the same React commit phase
during first paint, so the gap measures the shared hydration window,
not each component's individual cost. The in-component markers cannot
disambiguate AboveFold TBT.

### Phase 2B — AboveFold (React Profiler API)

Replaced the in-component markers with `<Profiler id="X"
onRender={profileOnRender}>` wrappers. `actualDuration` from
`onRender` reports the time React spent rendering each subtree during
the commit phase, which is a direct proxy for the component's TBT
contribution.

```
/   lenis-provider    actual=59.8 ms  base=47.4 ms  ← largest single component
    system-provider   actual=52.6 ms  base=41.4 ms
    hero              actual= 5.2 ms  base= 3.7 ms  ← framer-motion is NOT the bottleneck
    navbar            actual= 1.8 ms  base= 1.1 ms
    scroll-depth-tracker actual= 0 ms                ← returns null
/tl lenis-provider    actual=64.8 ms  (Δ +5 ms)
    system-provider   actual=57.2 ms  (Δ +5 ms)
    hero              actual= 8.1 ms  (Δ +3 ms)
    navbar            actual= 2.0 ms
```

The /tl delta (~10–15ms, distributed across components) is the cost
of the larger Tagalog translation tree parsing.

**Headline finding**: AboveFold TBT is dominated by Lenis (~60ms) and
SystemProvider's GraphSimulation/SystemBus init (~53ms). Hero,
Navbar, and ScrollDepthTracker are negligible.

### Step 5a (Lighthouse-isolated): Project detail LCP

`src/components/project-preview/preview-frame.tsx`: added an
IntersectionObserver with `200px` rootMargin around the cross-origin
iframe, plus `loading="lazy"` on the iframe and `fetchPriority="high"`
on the gallery priority image in
`src/app/[locale]/(marketing)/projects/[slug]/page.tsx`. LCP on
`/projects/isp-platform` was 4.13s in the P1 Lighthouse run; the
iframe was the dominant off-thread cost. Scope was isolated to
project detail. Lighthouse re-run pending.

### Step 5b (Commit A): Lenis idle init

Moved `new Lenis(...)` and the raf loop into a function scheduled
via `requestIdleCallback` (with a 200ms `setTimeout` fallback for
Safari). Lenis is progressive enhancement (smooth scroll), so the
page is fully usable during the idle wait. Re-measured after the
change:

```
/   lenis-provider    actual=16.7–43.4 ms  (avg ~30 ms, was 59.8 ms)
    system-provider   actual=13.9–37.8 ms  (avg ~30 ms, was 52.6 ms)
    hero              actual= 1.7–3.1 ms   (was 5.2 ms)
/tl lenis-provider    actual=38.3–42.3 ms  (was 64.8 ms)
```

The system-provider measurement also dropped as a side effect: with
synchronous Lenis work removed from the React commit phase, the rest
of the AboveFold tree committed faster.

Total estimated TBT reduction: **~70ms** (235ms → ~165ms measured,
Lighthouse pending re-run). The remaining gap to the 150ms gate is
~15ms, achievable only with a provider-contract refactor across
4–5 files (deferred; see "Out of scope" below).

### Step 5b (Commit B, NOT APPLIED): SystemProvider lazy init

Lazily initializing `GraphSimulation` + `SystemBus` in a `useEffect`
would save another ~10–20ms but requires changing the contract of
`useSystem()` and `useActiveNode()` to tolerate null sim/bus, plus
updating all 4 consumers (Hero, FeaturedProjects, CapabilitiesSection,
ProcessScrollytelling). The risk/reward ratio is poor for the
remaining gap. **Not applied.** If a future Lighthouse run still
fails narrowly on TBT, revisit with more context.

### Step 5b (BelowFold LazyMount, NOT APPLIED)

Two attempts were made and reverted:

- LazyMount with IntersectionObserver (d128df2 → reverted in 3586e15):
  broke 10 e2e tests (deep-linkability, header-nav, locale-toggle,
  scroll-anchors) due to scroll-to-hash races with Lenis intercepting
  native `scrollIntoView()`.
- `requestIdleCallback` returning `null` until idle: broke 21 tests
  because BelowFold sections weren't in the DOM at the test's
  assertion time.

The 53% BelowFold contribution is real but **deferring it costs more
in test stability than it saves in TBT**. Re-evaluating this would
require a different strategy (e.g., render DOM eagerly, defer only the
import resolution — not yet proven feasible).

### Out of scope (separate performance phases)

These remain open and are **not** part of Step 5:

- **Project detail LCP** (`/projects/isp-platform` was 4.13s).
  Step 5a addressed the iframe; gallery image, font preload, and
  third-party script cost still TBD. Recommended next: rerun
  Lighthouse on the Vercel preview after `af27841`.
- **Route-level JS reduction** (e.g., admin/shared chunks).
- **Image optimization** (responsive `<img>` / `next/image` audit).

## Reference

- Profiler data captured in `logs/tbt-step5c.log`, `logs/tbt-step5d.log`,
  `logs/tbt-commit-a.log`, `logs/tbt-commit-a-2.log`.
- Original Lighthouse baseline: `lighthouse/2026-06-02/`
  (12 reports, 6 routes × 2 form factors).
- Commit `af27841` is the Lenis fix (Commit A).
- Commits `850261c`, `50b86f9`, `d0eaa7c` were the temporary
  attribution work; `d0b8135` reverted the instrumentation while
  keeping `af27841`.
