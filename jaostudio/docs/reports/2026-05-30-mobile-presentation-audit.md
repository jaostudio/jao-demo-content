# Mobile Presentation Audit — 2026-05-30

Summary
-------
- Pages audited (programmatic): Home, About, Services, Projects, Contact
- Viewports: 360, 375, 390, 412 (height: 844)
- Checks performed: element bounding-box capture (`getBoundingClientRect`), document `scrollWidth` vs `innerWidth`, presence/count heuristics for project cards and process steps. Viewport screenshots were captured during the run for manual review.

Automated findings (high level)
--------------------------------
- Horizontal overflow: NONE detected (for all pages/widths `scrollWidth <= innerWidth`).
- Hero heading (`h1`): consistently present and readable across widths; bounding-box `y` position stable across viewports (no programmatic vertical shift when menu toggles).
- Primary CTA: detected on pages with `main`; visible in viewport for audited widths.
- Process scrollytelling detection: automated selector heuristics did NOT reliably detect step elements (`steps` reported 0 in multiple pages). Manual inspection required for accurate step spacing and sticky behavior checks.
- Project cards detection: heuristics failed to identify standard `.project-card` or `data-project-card` elements (reported `projectCardCount: 0`); the Projects page likely uses different markup — manual visual inspection is required.

Per-page notes (automated metrics summary)
-----------------------------------------
Home
- Hero `h1` top ≈ 125px across widths; CTA visible around y≈269px.
- No horizontal overflow (example: 360 → scrollWidth 354, innerWidth 360).
- Programmatic process section found but step items not detected by heuristic selectors — check sticky step spacing and overlap manually.

About
- `h1` detected and readable across widths.
- No overflow detected.

Services
- `h1` detected; project/service cards may use custom classes — automated card count may be 0. Manual check recommended for card heights and CTA placement.

Projects
- Automated card detection returned 0; manual review required for image aspect ratios, card alignment, button placement.

Contact
- Contact form present and appears within viewport bounds on tested widths.

Heuristic/limitations
---------------------
- Automated selectors used are conservative (look for `.project-card`, `[data-project-card]`, `.step`, common headings). The site uses semantic and bespoke classnames — automated detection missed some components.
- Visual/subjective qualities (hierarchy, perceived quality, animation smoothness) cannot be fully judged by bounding-box metrics. These require human review on device or high-res screenshots.

Recommendations / Next steps (manual-focused)
-------------------------------------------
1. Skip further navbar/scroll-lock work (DEFERRED). See ticket: `../plans/14-mobile-transformation/11-navbar-ticket-deferred.md`.
2. Run a manual mobile presentation audit (QA as client) on physical devices or high-fidelity screenshots. Pages to cover: Home, About, Services, Projects, Contact.
3. Evaluation checklist (for each page / width):
   - Visual hierarchy: is the primary message obvious within the first viewport?
   - Symmetry: are margins and alignment consistent across breakpoints?
   - Spacing consistency: are vertical rhythm and padding uniform between sections?
   - Card heights: do cards align horizontally without uneven bottoms?
   - CTA visibility: primary CTA should be prominent and reachable within first 1–2 screens.
   - Animation smoothness: watch for stutter during scroll and menu open interactions.
   - Readability: font sizes, line-length, and contrast on mobile.
   - Empty space: ensure negative space communicates quality, not missing content.
   - Perceived quality: check for cramped visuals (hero graph), image aspect-ratio issues in Projects, and any decorative overlap.
4. Pay special attention to:
   - Process scrollytelling: verify step spacing, sticky behavior, scroll progress indicator, and card overlap on mobile.
   - Projects: inspect image aspect ratios, card alignment, and button placement.
   - Hero node graph: confirm it doesn't feel visually cramped — prefer visual inspection over relying on reduced height heuristics alone.
5. Produce a short severity-ranked list of issues (P1–P3) with screenshots and suggested fixes (presentation-first: spacing, hierarchy, assets).

Acceptance criteria for audit complete
------------------------------------
- Manual pass or a prioritized list of presentation issues for each page with screenshots.
- No further code-level fixes to the navbar until a clear, user-visible reproduction is provided from a physical device.

Artifacts
---------
- Programmatic metrics and screenshots captured during the run (available in test artifacts and Playwright run directory).
- Navbar deferred ticket: `../plans/14-mobile-transformation/11-navbar-ticket-deferred.md`.
