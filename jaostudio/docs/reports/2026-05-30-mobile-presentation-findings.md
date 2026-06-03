# Mobile Presentation Findings — Detailed (2026-05-30)

This file expands the high-level audit into actionable, per-page findings with evidence and code-level suggestions. Use this as the implementation checklist for presentation fixes.

Summary evidence
- Emulated widths: 360 / 375 / 390 / 412 (height 844)
- Artifacts: bounding-box metrics and viewport screenshots captured during the run (available in Playwright artifacts / `test-results/`).

Home
- Findings:
  - `h1` position stable (top ≈ 125px). Primary CTA visible (~y 269px).
  - Hero node graph is rendered below the hero and uses reduced mobile height (`h-[200px]`). This prevents overlap but introduces a perception risk: graph may feel cramped, and details may be illegible on small devices.
- Fix suggestions:
  - Reduce visual complexity on mobile: limit nodes to 3–4 and disable particle effects. In `src/components/system/node-graph.tsx` wrap expensive effects with a mobile check (already present) and reduce node count when `isMobile`.
  - If retaining detail is important, increase mobile container height slightly: set mobile class to `h-[220px]` in `src/components/sections/hero/hero.tsx`.

About
- Findings:
  - Headings, body copy, and CTA fit mobile viewports. No overflow detected.
  - Studio content long text blocks may create long vertical scroll — acceptable, but consider CTA repetition mid-page.
- Fix suggestions:
  - Consider adding a sticky CTA or smaller secondary CTA after the first section for easier conversions.

Services
- Findings:
  - Service cards use bespoke markup; automated card detection was inconclusive. Verify card spacing and alignment across widths.
- Fix suggestions:
  - Ensure each card uses consistent media container sizing. Example CSS:

```css
.card__media { aspect-ratio: 16/9; width: 100%; height: auto; object-fit: cover; }
.card { display: flex; flex-direction: column; }
.card__content { min-height: 140px; }
```

Projects
- Findings:
  - Automated heuristics failed to find `project-card` elements. Manual inspection required for image aspect ratios and consistent card heights.
  - Risk: irregular image aspect ratios or missing object-fit can cause uneven card bottoms and misaligned CTAs.
- Fix suggestions (P1):
  - Enforce image containers with `aspect-ratio` and `object-fit: cover`.
  - Add a CSS utility to equalize card heights (flex layout with `min-height` on content area) or use CSS grid with `align-content: start`.

Contact
- Findings:
  - Contact form present and within viewport bounds. Form fields render correctly on mobile.
- Fix suggestions:
  - Ensure form labels are accessible and stacking order is correct; consider slightly larger touch targets for inputs/buttons on small widths.

Process scrollytelling (cross-page)
- Findings:
  - Heuristics did not reliably detect step items; markup appears bespoke.
  - Potential issues to verify manually: step spacing, sticky behavior thresholds, progress indicator visibility, and card overlap on small screens.
- Fix suggestions:
  - Audit step spacing and sticky offsets at `max-width: 640px`. Example CSS tweak:

```css
@media (max-width: 640px) {
  .process-step { margin-bottom: 1.25rem; }
  .process .sticky { top: 68px; } /* account for header height */
}
```

Testing & verification
- Use the captured screenshots and bounding boxes in `test-results/` to cross-check before/after changes.
- After each fix, run the emulated mobile audit again and verify:
  - `scrollWidth <= innerWidth`
  - `h1` and CTA positions remain stable
  - Project card image ratios and card bottoms visually align

Implementation notes
- Keep fixes presentation-focused: prefer CSS and minimal DOM changes.
- Avoid navbar scroll-lock work (deferred). Revisit only if a physical-device reproduction occurs.

Next steps (recommended order)
1. Projects: normalize image aspect ratio + enforce card layout (P1).
2. Process: manual audit and CSS spacing fixes (P2).
3. Hero: reduce nodes or increase mobile height slightly (P2).
4. Small polish: CTA repetition, input touch targets, spacing rhythm (P3).

Extended audit: Projects & Process (results)
-------------------------------------------
What I ran:
- Focused emulated audit for `Home` (process scrollytelling) and `/projects` (project cards) at widths 360 / 375 / 390 / 412.

Results summary:
- `Home` process section: `processSection` detected but automated step selectors returned `stepCount: 0` across widths. No sticky element detected by computed-style scanning. This implies bespoke markup for steps that the heuristics don't match.
- `Projects` page: automated selectors did not find project-card elements (reported `foundCount: 0` across widths). Fallback searches also returned 0 candidates. This indicates the Projects list uses non-standard classes or renders cards via an unusual DOM structure (or client-side render timing that missed the snapshot).

Implications:
- The audit cannot reliably assert card heights, image aspect ratios, or step spacing automatically until we identify the correct selectors or add stable `data-*` attributes.

Concrete next actions (developer)
--------------------------------
1. Identify canonical selectors for project cards and process steps. In the browser console run this snippet on the Projects page to find repeating element paths:

```js
// Run in browser console on /projects
(function(){
  const candidates = Array.from(document.querySelectorAll('*')).filter(el=> el.children.length && el.querySelector('img'));
  const map = new Map();
  for (const el of candidates) {
    const key = el.tagName.toLowerCase() + (el.className? '.'+el.className.split(' ').filter(Boolean).slice(0,2).join('.') : '');
    map.set(key, (map.get(key)||0)+1);
  }
  Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([k,c])=>console.log(k,c));
})();
```

2. Add stable test hooks where appropriate:
   - For project cards: add `data-project-card` to the card root element.
   - For process steps: add `data-process-step` to each step element and `data-process-root` on the container.

3. Re-run the focused audit after adding hooks or confirming selectors.

4. Short-term presentation fixes (once selectors are known):
   - Enforce `aspect-ratio` on media containers and `object-fit: cover`.
   - Equalize card heights using CSS grid/flex with a `min-height` on metadata/content regions.
   - For process steps, set mobile step spacing and sticky offsets via the CSS snippet included earlier.

Why this matters
-----------------
Automated audits are only as good as the selectors they use. Adding small, intentional `data-*` attributes makes future audits deterministic and reduces flakiness in Playwright runs while keeping markup semantics intact.

Evidence files
--------------
- Playwright run artifacts contain the screenshots and truncated base64 samples captured during this audit. Use them to cross-check visual appearance after fixes.

Selector discovery results (programmatic)
----------------------------------------
I ran a DOM-sniff on `/projects` and `/` to find repeating selectors. Key findings (use these for deterministic audits):

- Projects (cards):
  - Card anchors live under: `main#main-content > div.mx-auto.w-full > div.grid.gap-8 > a` — each anchor wraps a project card.
  - Card content container: `div.relative.rounded-2xl` inside the anchor.
  - Title selector observed: `h3.text-[var(--text-card-title)].font-[var(--weight-medium)]`.
  - Example Playwright selector to capture cards: `main#main-content a[href^="/projects/"] > div.relative.rounded-2xl`.

- Process scrollytelling (Home):
  - Process section heading: `h2` with text "How I build projects from brief to launch." — the process view uses buttons for each step inside a complementary area.
  - Step buttons observed as: `section:has-text("How I build") button` (Playwright friendly). Example button text: "01 Align", "02 Plan", ...
  - Example Playwright selector to capture step buttons: `section:has-text("How I build") button`.

Playwright snippets (quick audit)
--------------------------------
1) Count project cards and capture bounding rect for first card:

```js
const cards = await page.$$('main#main-content a[href^="/projects/"] > div.relative.rounded-2xl');
console.log('cards', cards.length);
const rect = await cards[0].boundingBox();
console.log(rect);
```

2) Capture process step button positions:

```js
const steps = await page.$$('section:has-text("How I build") button');
for (const s of steps) console.log(await s.evaluate(n=>n.textContent.trim()), await s.boundingBox());
```

Recommendation
--------------
- Use the discovered selectors for automated audits (bounding-box checks and screenshot captures). They match the present DOM and avoid brittle heuristic matching.
- Add `data-project-card` and `data-process-step` attributes if you prefer explicit hooks for future tests; otherwise, use the anchor and button selectors above.



Files referenced
- High-level QA summary: [../plans/14-mobile-transformation/09-qa-summary.md](../plans/14-mobile-transformation/09-qa-summary.md)
- Deferred navbar ticket: [../plans/14-mobile-transformation/11-navbar-ticket-deferred.md](../plans/14-mobile-transformation/11-navbar-ticket-deferred.md)
- Audit report: [2026-05-30-mobile-presentation-audit.md](2026-05-30-mobile-presentation-audit.md)
- Severity report: [2026-05-30-mobile-presentation-issues.md](2026-05-30-mobile-presentation-issues.md)
