## Mobile QA Summary — Playwright + Local Checks (2026-05-30)

Summary:

- Overflow checks (horizontal) at mobile widths 360 / 375 / 390 / 412: PASS (no document scrollWidth > innerWidth detected).
- Menu scroll-lock checks (automated Playwright assertions on `window.scrollY`): FAIL across tested widths — Playwright observed `scrollY` changes after opening the mobile menu (example: Expected 0, Received 137).

Findings & analysis:

- The project uses Lenis (smooth scroller) via `src/components/layout/lenis-provider.tsx`. Lenis can decouple `window.scrollY` from the visual transform used for smooth scrolling. A Playwright assertion against `window.scrollY` can therefore be misleading if Lenis applies transform-based virtualization.
- The mobile menu is rendered as a portal overlay (`document.body` portal) with a full-screen fixed container; the navbar sets `document.body.style.position = 'relative'` when opening the menu. This combination may lead to `window.scrollY` changes while the overlay fully obscures content — not necessarily a user-visible regression.

Impacted files (investigate first):

- `src/components/layout/navbar.tsx` — mobile menu portal and current scroll-lock implementation
- `src/components/layout/lenis-provider.tsx` — Lenis smooth-scrolling implementation
- `src/components/sections/hero/hero.tsx` — node graph sizing on mobile
- `src/components/system/node-graph.tsx` — graph rendering and SVG layout

Recommended immediate next steps (manual-first):

1. Manual validation on real devices (iPhone Safari, Android Chrome) for these scenarios: open menu at top/mid/footer, try swipe/pull/overscroll to confirm user-visible background movement.
2. If reproduced on a real device: implement fixed-body lock using `position: fixed; top: -<scrollY>px;` + `html,body.menu-open { overflow:hidden; overscroll-behavior:none; }` and restore scroll on close. Avoid Lenis-specific coupling unless necessary.
3. If NOT reproduced on devices: remove the `mobile-menu-lock` Playwright test (it measures `window.scrollY`, which may not reflect visual scroll under Lenis) and keep overflow tests and other QA in CI.

Temporary mitigations already applied in repo (code changes & tests):

- Playwright e2e tests added: `e2e/mobile-overflow.spec.ts` and `e2e/mobile-menu-lock.spec.ts` (menu-lock failing under automation).
- Small responsive sizing adjustments to the hero graph are proposed to reduce overlapping text on small screens (see change in `hero.tsx`).

Status: Unproven user-facing menu bug. Prioritize manual verification and mobile overflow audit before implementing navbar scroll-lock changes.
