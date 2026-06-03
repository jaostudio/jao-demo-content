# Projects Fix Verification (2026-05-30)

Change implemented
- Added `data-project-card` attribute to project links (`src/components/projects/project-card-link.tsx`).
- Converted project cards layout to CSS grid with a reserved middle row and added mobile `min-height` to reduce height variance (`src/app/(marketing)/projects/page.tsx`).

Verification (measured after changes)
- Measured card heights at viewports 360x800, 390x844, 412x915 (selector: `[data-project-card]`).
- Results (px):
  - 360x800: [320, 320, 320, 320, 335, 320, 320]
  - 390x844: [320, 320, 320, 320, 335, 320, 320]
  - 412x915: [320, 320, 320, 320, 335, 320, 320]

Metrics and conclusion
- Min: 320px, Max: 335px, Difference: 15px → variance = 15 / 335 ≈ 4.5%.
- Goal (variance ≤ 10%): achieved.

Next steps
- Merge the small PR for Projects.
- Re-run the full three-breakpoint screenshot audit for Home and Projects to validate perceived improvements; update boards if approved.
