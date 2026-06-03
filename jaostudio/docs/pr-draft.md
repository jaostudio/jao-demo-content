# PR Draft: fix/projects-card-consistency

Summary
- This PR bundles small, low-risk fixes from the mobile visual audit and supporting artifacts for `.opencode` to act on:
  - Ensure project cards have more consistent heights and avoid clipping on small screens.
  - Make the Projects carousel reliably swipeable on mobile (`touch-action`, `-webkit-overflow-scrolling`).
  - Add mobile-friendly Contact form improvements: increased touch targets, safe-area-aware bottom padding, and a portal-mounted flush CTA to avoid clipping.

Files changed
- `src/components/projects/projects-carousel.tsx` — native mobile scrolling enabled and small-screen card width reduced; CTA icon hidden on small screens.
- `src/components/sections/contact-section.tsx` — inputs increased padding; form bottom padding uses `calc(64px + env(safe-area-inset-bottom))`; portal-mounted mobile CTA flushed to screen edges.
- `src/components/system/node-graph.tsx` / `src/components/sections/hero/hero.tsx` — (previous commit) compact node graph applied on mobile.

Artifacts (local workspace)
- Mobile screenshots: `.opencode/screenshots/*` (root, projects, services, process, contact, work) at 360/390/412.
- Annotations: `./annotations/*-annotations.md` (home, projects, contact, services, process).
- Boards index: `./boards/mobile-visual-boards.md`.
- Mobile audit report: `./reports/2026-05-30-mobile-visual-audit.md` and consolidated fix list at `./reports/2026-05-30-mobile-fixed-action-list.md`.

QA / How to review
1. Open the PR draft URL (pasted below).
2. On the preview deployment (or local `npm run dev`), test these scenarios on a handset or emulator:
   - Featured Projects: horizontal swipe on 360/390/412 widths.
   - Contact: open keyboard, focus fields, ensure CTA doesn't overlap the active field; submit form.
   - Home Hero: ensure compact node graph on mobile and H1/CTA visual dominance.
3. Review screenshots in `.opencode/screenshots` to compare before/after visuals.

Notes
- `.opencode` is intentionally ignored by git and contains artifacts for reviewers; include them in PR attachments if desired.
- These fixes are intentionally small. For larger UX/design changes, .opencode should implement the design-approved sticky CTA or bottom sheet pattern.
