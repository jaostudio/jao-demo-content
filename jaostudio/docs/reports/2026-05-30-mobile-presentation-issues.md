# Mobile Presentation Issues — Severity-ranked (2026-05-30)

Summary
-------
This report compiles findings from a browser-mode mobile audit (emulated widths 360, 375, 390, 412) across Home, About, Services, Projects, and Contact. The audit collected element bounding boxes, project card/image metrics, and screenshots for review.

Global verdict
-------------
- Horizontal overflow: none detected.
- Primary CTAs: visible and reachable on tested viewports.
- No user-visible background movement on menu open in emulated browser mode.

Severity key
------------
- P1: High — affects usability or conversions on mobile
- P2: Medium — impacts perceived quality or layout consistency
- P3: Low — minor polish or aesthetic improvements

P1 (High)
---------
- Projects page: automated detection failed to identify project cards (`projectCardCount: 0` via heuristics). Risk: images/aspect ratios or card markup may be non-uniform, causing inconsistent card heights and CTA placement across breakpoints.
  - Action: Manually review Projects page in mobile viewport. Verify image aspect ratios, enforce a consistent card height or use object-fit with fixed aspect ratio containers, and ensure primary action buttons align across rows.

P2 (Medium)
-----------
- Process scrollytelling: heuristics did not reliably detect step items; automated `steps` count often returned 0. This suggests bespoke markup is in use and may lead to spacing or sticky-behavior issues on mobile.
  - Action: Manually test Process scrollytelling for step spacing, sticky header behavior, scroll progress visibility, and card overlap. If issues found, adjust step spacing and sticky thresholds for small widths.

- Hero node graph density: the node graph height was reduced for mobile (`h-[200px]`), which prevents overlap but may make the graph feel cramped.
  - Action: Evaluate whether the reduced height preserves perceived quality. Consider simplifying nodes/effects on mobile (fewer nodes, disable particles) and keeping a slightly larger container if it improves balance.

P3 (Low)
--------
- Visual rhythm & spacing: automated metrics show consistent `h1` positions and CTA placement, but visual symmetry and spacing should be audited by eye across breakpoints.
  - Action: Tweak vertical rhythm (padding, margins) where the hero transitions to content to maintain perceived balance.

- Animations: Smoothness and motion quality were not measured. Watch for scroll jank and menu-open animation stutter on lower-power devices.
  - Action: If stutter is observed during manual review, consider reducing effect complexity on mobile and enabling `prefers-reduced-motion` fallbacks.

Recommended immediate fixes (ordered)
-----------------------------------
1. Projects: Normalize card markup and enforce image aspect ratios (P1).
2. Process scrollytelling: Test and fix sticky/step spacing (P2).
3. Hero: Re-evaluate node graph sizing vs simplification on mobile (P2).
4. Global polish: small spacing adjustments and motion fallbacks (P3).

Deliverables suggested
--------------------
- A short PR for Projects page: enforce `.card__media { aspect-ratio: 16/9; object-fit: cover; }` and ensure card content uses a consistent min-height.
- A scrollytelling QA checklist and small CSS patch to tweak step spacing at `max-width: 640px`.
- A hero mobile tweak: reduce node count and disable particles, or minimally increase the mobile container to `h-[220px]` if that improves perceived balance.

Notes on evidence
-----------------
- Automation artifacts (bounding boxes, truncated screenshots) were generated and are available in the Playwright run artifacts. These informed the above heuristics but do not replace visual review.
- The navbar scroll-lock investigation has been deferred; no further action taken there per direction.
