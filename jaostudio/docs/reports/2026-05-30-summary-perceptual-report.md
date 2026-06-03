# Mobile Perceptual Summary Report (2026-05-30)

Purpose
-------
This short report translates the screenshot boards and annotations into client-facing perceptual findings, ranked fixes, and exact PR tasks so engineering work improves what users see first.

Top-line verdict
----------------
- The site is technically solid and feels professional, but several mobile breakpoints show perceptual issues that reduce immediate clarity and trust. Addressing the hero hierarchy, project card consistency, and contact CTA will yield the highest perceptual ROI.

Key perceptual findings (ranked)
--------------------------------
1) Hero hierarchy and CTA (High impact)
  - Problem: Decorative node graph competes with headline/CTA on smallest widths; CTA can sit near/below fold.
  - Perceptual cost: Users may not identify the site's purpose within 3 seconds.
  - Fix (PR 1): Mobile-only reduction of node graph (fewer nodes + disable particles) OR increase hero height to 220px; increase CTA size/contrast and ensure CTA is above fold.

2) Projects — card alignment & media consistency (High impact)
  - Problem: Uneven card bottoms and inconsistent thumbnail crops make the portfolio look unpolished.
  - Perceptual cost: Rows read misaligned; CTAs unpredictable.
  - Fix (PR 2): Enforce `aspect-ratio:16/9` on media, use `<img>` with `object-fit: cover` where possible, reserve `min-height` for meta, clamp text to 2 lines, add `data-project-card`.

3) Contact CTA & form touch targets (High impact)
  - Problem: Primary contact action may be below fold; form inputs compact.
  - Perceptual cost: Higher friction to convert; mobile users may drop off.
  - Fix (PR 3): Ensure primary CTA visible above fold; increase input heights and spacing; optionally add sticky CTA.

4) Services clarity (Medium impact)
  - Problem: Cards lack instant outcome/price cues.
  - Fix (PR 4): Add short label/price hint and standardize CTA placement.

5) Process spacing & density (Medium impact)
  - Problem: Steps are tall and tightly spaced.
  - Fix (PR 5): Reduce min-height to ~72px and increase vertical gaps to 16px on mobile.

Implementation checklist (exact PR tasks)
--------------------------------------
- PR 1: `feat(hero): mobile visual weight reduction`
  - Add CSS class `hero--mobile-slim` to reduce animation and simplify node graph.
  - Increase hero mobile height to `h-[220px]` or reduce nodes via props.
  - Increase `.hero .cta` padding and font-size at mobile breakpoints.

- PR 2: `fix(projects): consistent thumbnails + card heights`
  - Add `.card__media { aspect-ratio: 16/9; background-size: cover; }` or convert to `<img>` with `object-fit: cover`.
  - Add `.card__meta { min-height: 96px; }` and `line-clamp-2` for titles/summaries.
  - Add `data-project-card` attribute to anchors for future audits.

- PR 3: `fix(contact): mobile CTA and form spacing`
  - Ensure primary CTA visible on initial viewport by moving or increasing prominence.
  - Increase form input `min-height` to 44–48px and add spacing between fields.

- PR 4: `feat(services): quick outcome labels`
  - Add optional `data-price-hint` slot, render short label on mobile.

- PR 5: `style(process): mobile spacing tweaks`
  - Add media query to reduce step height and increase `margin-bottom` to 16px.

Verification plan
-----------------
For each PR:
- Re-run the three mobile screenshots (360/390/412) and visually confirm: headline/CTA hierarchy, card bottoms alignment, contact CTA above fold.
- Run the selector-driven metrics for Projects to confirm height variance % < 10%.

Suggested sequencing and timebox
--------------------------------
- Day 0 (small PRs): PR 2 (Projects) — high ROI and low-risk (30–90m)
- Day 1: PR 1 (Hero) and PR 3 (Contact) — visual impact, check accessibility (1–3h)
- Day 2: PR 4 + PR 5, polish and re-audit (1–2h)

Final note
----------
Focus on perception-first changes: small CSS/markup updates that make the site read as premium on first glance. After these PRs, we can add `data-section` hooks and automated perceptual checks.
