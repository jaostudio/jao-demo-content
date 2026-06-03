# PR Review Checklist — Mobile Audit PR

Use this checklist when reviewing the PR `fix/projects-card-consistency` (or any subsequent PRs implementing mobile fixes).

1) Artifacts included
- `docs/audit-artifacts/contact-360.png` — representative contact page screenshot (360px)
- `docs/audit-artifacts/projects-360.png` — representative projects carousel screenshot (360px)
- `docs/audit-artifacts/home-360.png` — representative home hero screenshot (360px)

2) Visual QA (manual)
- [ ] Open the preview deployment or run locally (`npm run dev`) and test these pages on a real device or emulator at 360/390/412 widths: `/`, `/projects`, `/contact`.
- [ ] Contact: focus inputs, open keyboard, ensure CTA is not covering the active field; submit form.
- [ ] Projects: swipe carousel left/right twice and confirm cards snap and content is reachable.
- [ ] Home: confirm hero headline is readable and primary CTA is above the fold at 360.

3) Automated checks
- [ ] Run mobile screenshot sweep (repo helper):

```
node scripts/mobile-sweep.js --url <preview-url>
```

- [ ] Run Lighthouse on these pages and attach the JSON reports: `/`, `/projects`, `/contact`.

4) Performance thresholds (guard rails)
- LCP: target < 2.5s (or not worse than current baseline)
- CLS: target < 0.05
- TBT: target < 150ms

5) Accessibility checks
- [ ] Form error messages are announced (role=alert) and inputs have aria-describedby for errors.
- [ ] Keyboard navigation order is logical and portal CTA can be triggered with keyboard.

6) Merge criteria
- [ ] All P1 items verified on device and screenshots attached.
- [ ] No regressions in Lighthouse thresholds beyond allowed tolerance.
- [ ] Reviewer sign-off from design (if CTA style or layout changed).
