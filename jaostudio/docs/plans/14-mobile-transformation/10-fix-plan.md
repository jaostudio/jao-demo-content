# Mobile Menu Fix Plan (execution-grade)

Goal
----
Confirm whether the mobile menu permits visible background scrolling on real devices and, if so, implement a robust, cross-browser fixed-body scroll-lock with minimal coupling to Lenis.

Scope
-----
- Pages: Home (`/`), About (`/about`) and any route that uses `src/components/layout/navbar.tsx`.
- Components: `src/components/layout/navbar.tsx`, `src/components/layout/lenis-provider.tsx`.
- Tests: Playwright e2e (visual diffs + bounding-box assertions) under `e2e/`.

Steps (ordered)
----------------
1. Manual device validation (owner: dev):
   - Devices: iPhone (Safari, varying iOS versions) and Android (Chrome).
   - Scenarios: open menu at top, mid-page, bottom; try swipe/overscroll/pull-to-refresh.
   - Outcome: record whether background content visibly moves under the overlay.

2. If user-visible movement is reproduced -> Implement fixed-body lock (owner: dev):
   - On menu open: record `const scrollY = window.scrollY`.
   - Apply:
     - `document.documentElement.classList.add('menu-open')`
     - `document.body.style.position = 'fixed'`
     - `document.body.style.top = `-${scrollY}px``
     - `document.body.style.left = '0'`
     - `document.body.style.right = '0'`
     - `document.body.style.width = '100%'`
   - On close: remove inline styles and `document.documentElement.classList.remove('menu-open')`; call `window.scrollTo(0, scrollY)` to restore.
   - CSS: add `html.menu-open, body.menu-open { overflow: hidden; overscroll-behavior: none; }` (or use a single selector if preferred).
   - Keep changes localized to `navbar.tsx` and export a small helper to avoid duplication.

3. If no visual reproduction on real devices -> adjust automation (owner: dev):
   - Remove or update the Playwright test asserting `window.scrollY` and replace with visual-diff or bounding-box checks that assert the same element `getBoundingClientRect().y` before/after.

4. Add tests (owner: dev/QA):
   - Visual diff test: capture `h1` bounding rect before and after menu-open and assert delta ≤ 1px.
   - Screenshot diff: full-viewport before/after with a small tolerance.
   - Re-run CI; ensure e2e job includes the visual-diff tests.

5. QA sweep & report (owner: QA):
   - Re-run Playwright on target widths and devices (if available).
   - Produce a severity-ranked report of any remaining visual/UX issues.

Acceptance criteria
-------------------
- No user-visible background movement when mobile menu is open on supported devices (iPhone Safari, Android Chrome).
- CI contains visual-diff tests that fail on regressions.
- No flaky assertions left that rely on `window.scrollY` alone while Lenis is active.

Risks & notes
-------------
- Lenis virtualized scrolling means `window.scrollY` may not match visual scroll; prefer bounding-box/screenshot tests.
- `position: fixed` approach must be tested with fixed elements (headers, footers) to avoid layout jumps.

Files to change
---------------
- `src/components/layout/navbar.tsx` (primary)
- `src/components/layout/lenis-provider.tsx` (only if Lenis pause is later required)
- `e2e/mobile-menu-visual.spec.ts` (new test)

Estimated effort
----------------
- Manual verification: 0.5–1h (developer on device).
- Implement + test fix: 1–2h if reproduction confirmed. If not reproduced, 0.5–1h to update tests.

Follow-ups
----------
- If fixed-body lock is applied, add regression screenshots to the repo and a short PR checklist demonstrating manual device checks performed.
