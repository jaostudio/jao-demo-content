# QA Summary

- **home**: perf=45 LCP=28256 CLS=0 TBT=3951 — HTML: `../.opencode/lighthouse/home.html`
- **projects_isp-platform**: perf=70 LCP=1610 CLS=0.021555 TBT=2675 — HTML: `../.opencode/lighthouse/projects_isp-platform.html`
- **services**: perf=51 LCP=5232 CLS=0 TBT=2950 — HTML: `../.opencode/lighthouse/services.html`
- **contact**: perf=51 LCP=5207 CLS=0 TBT=2856 — HTML: `../.opencode/lighthouse/contact.html`

## Logs

- smoke-2026-05-29T07-13-18-829Z.json

## Projects

- design-system
- desktop
- ecommerce-store
- isp-platform
- landing-page
- mobile
- mobile-web-app
- og
- saas-frontend
- thumbnails
- web-application

## Screenshot Validation

- Target: `http://localhost:3002`
- Count: 14 screenshots
- Size range: 20.8 KB to 46.7 KB
- Visual check: passed on sampled renders

## Mobile QA (2026-05-30)

- Playwright visual audit (Home + About at 360 / 375 / 390 / 412): PASSED — element bounding-box checks and before/after screenshots show no visible page shift after opening the mobile menu.
- Playwright `window.scrollY` menu-lock test: FAIL (automation observed `window.scrollY` change). Investigation indicates this assertion is unreliable due to Lenis virtualized scrolling.
- Manual verification: PENDING — recommended on iPhone (Safari) and Android (Chrome) to confirm whether the failure is user-visible before code changes.

## Next steps / Plan

- Manual device validation of mobile menu scenarios (top / mid / footer; swipe/overscroll). If user-visible movement is observed, implement fixed-body scroll-lock; otherwise, remove or adjust the `window.scrollY` Playwright assertion and keep visual-diff checks in CI.
- Add Playwright visual-diff tests (screenshot or bounding-box assertions) to prevent regressions.
- If fixed-body lock is implemented, update `src/components/layout/navbar.tsx` to apply `position: fixed` + `top: -<scrollY>px` and restore `window.scrollTo()` on close; add CSS `html.menu-open, body.menu-open { overflow:hidden; overscroll-behavior:none; }`.

See `./plans/14-mobile-transformation/09-qa-summary.md` for detailed findings.
