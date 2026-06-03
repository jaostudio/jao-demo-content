# Consolidated Mobile Fix List — 2026-05-30

This file is an implementation-ready checklist for .opencode to apply mobile visual fixes. Each item includes the suggested file(s) to change, the rationale, and example code snippets.

Contact (priority P1)
- Files: `src/components/sections/contact-section.tsx`
- Issues: CTA clipping, insufficient bottom padding for fixed CTA, input touch targets.
- Recommended changes:
  1) Keep portal-mounted submit button but standardize safe padding on the form container:

     - Add bottom padding equal to CTA height + safe-area inset:

       ```tsx
       <form id="contact-form" className="..." style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
       ```

  2) Ensure inputs/selects/textarea use `py-4` (mobile) and `min-height:44px`:

       ```diff
       - className="... px-4 py-3 ..."
       + className="... px-4 py-4 max-sm:py-4 ..."
       ```

  3) Portal CTA pattern (already implemented): keep `MobileFixedSubmit` portal, ensure it uses `left:0; right:0;` with inner `px-4` to avoid clipping by side gutters.

Projects (priority P1/P2)
- Files: `src/components/projects/projects-carousel.tsx`
- Issues: swipe reliability, card clipping at smallest breakpoints, CTA pill cropping.
- Recommended changes:
  1) Keep native momentum scrolling on mobile (already applied):

       ```tsx
       <div className="... snap-x snap-mandatory overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
       ```

  2) Avoid card edge clipping at ≤360 by slightly reducing card width there. Example:

       ```css
       /* Tailwind: add responsive utility */
       .project-card { width: 75vw; }
       @media (max-width: 360px) { .project-card { width: 72vw; } }
       ```

  3) CTA inside card: on very small widths hide the left icon and make button full-width:

       ```tsx
       <span className="... max-sm:w-full max-sm:justify-center">
         <span className="max-sm:hidden"><ArrowRight /></span>
       </span>
       ```

Hero (priority P2)
- Files: `src/components/sections/hero/hero.tsx`, `src/components/system/node-graph.tsx`
- Issues: node-graph competes with content on small viewports.
- Recommended changes:
  1) Keep `compact` prop and static simplified graph for mobile (already implemented).
  2) Increase vertical spacing around hero copy on mobile: e.g., add `pt-6 pb-6` at ≤767px.

Services (priority P3)
- Files: `src/app/(marketing)/services/page.tsx` (or relevant components in `src/components/sections`)
- Issues: density, small CTAs.
- Recommended changes:
  1) Increase vertical rhythm: bump spacer tokens for lists at mobile breakpoints.
  2) Ensure CTAs use `h-12` or `min-h-[44px]`.

Process (priority P3)
- Files: `src/components/sections/process-scrollytelling.tsx`
- Issues: small step controls and cramped labels.
- Recommended changes:
  1) Increase button sizes to `min-h-[44px]`, add `px-3` and check overflow when keyboard is open.

QA/Verification Checklist
- For each change, produce screenshots at 360/390/412 and save to `.opencode/screenshots/<page>/`.
- Run interactive checks on a real device or emulator to confirm: swipe, keyboard behavior, focus, and no clipping.
- Performance: confirm no notable LCP regressions; run Lighthouse and compare.

Device / QA specifics (recommended)
- Devices to test (representative): iPhone SE / 8 (360×667), Pixel 4a (360×800), iPhone 12/13 (390×844), Pixel 6/7 / Galaxy S (412×915). At minimum validate 360 / 390 / 412 breakpoints.
- Visual pass criteria:
  - Primary CTA visible above fold for Hero (/ ) and Contact (/contact) at 360.
  - Project card height variance < 10% across the three breakpoints.
  - Inputs meet min 44px touch-height on mobile.
- Lighthouse thresholds (guard rails): LCP < 2.5s, CLS < 0.05, TBT < 150ms (compare to baseline; small deviations require review).

Interactive test steps (per P1)
- Contact form:
  1. Open /contact on device at 360.
  2. Tap name → keyboard appears; confirm input is visible and CTA does not overlay.
  3. Tap submit via portal CTA; ensure submission triggers and success state is reachable.
- Projects carousel:
  1. Open / or /projects at 360.
  2. Swipe left and right twice; confirm snap and no input trapping.
  3. Confirm CTA inside card is visible and not cropped.


Notes
- Small patches (CSS adjustments, container padding) are low-risk and high ROI — prioritize P1 items first.
- For any changes that require design decisions (CTA style, sticky UI), coordinate with design owner in `.opencode` before merging.
