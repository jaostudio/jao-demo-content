# Mobile Visual Issues — Detailed Findings (2026-05-30)

This report summarizes measured visual metrics from an emulated mobile audit (widths: 360, 375, 390, 412) focusing on Projects card layout and the Process scrollytelling on Home. It includes exact measurements and concrete fixes.

What was measured
- Projects: `main#main-content a[href^="/projects/"]` anchors (count, bounding-boxes)
- Process: `section:has-text("How I build") button` (step buttons positions and sizes)

Raw measured summary
- Projects page: 7 project anchors detected on all widths.

- Card heights (px):
  - 360px: [345.19, 345.19, 345.19, 345.19, 345.19, 369.19, 345.19] → min 345, max 369 (variation 24px, ~7%).
  - 375px: [345.19, 345.19, 345.19, 316.19, 316.19, 316.19, 345.19] → min 316, max 345 (variation 29px, ~9%).
  - 390px: [345.19, 345.19, 316.19, 316.19, 316.19, 316.19, 345.19] → min 316, max 345 (variation 29px, ~9%).
  - 412px: [316.19, 316.19, 316.19, 316.19, 316.19, 316.19, 316.19] → all 316 (uniform).

- Images inside cards: not detectable as `<img>` bounding boxes in our audit (returned `null`). Likely images are applied as background-image or lazy-loaded elements; `object-fit` not reported.

- Process steps (Home): 5 step buttons measured across widths. Button size: width varies with viewport, height ≈ 105px consistently. Vertical gap between steps ≈ 8–12px (small).

Interpretation
- Card height variation (up to ~9%) is visible on smaller widths where metadata length varies — this may cause uneven card bottoms and misaligned CTAs, hurting perceived polish (spotty alignment across rows).
- Absence of `<img>` detection suggests background-image usage; background images are fine but make automated audits harder. They also require explicit size/ratio CSS to ensure consistent layout.
- Process steps feel tightly spaced on mobile (small gaps and large button heights). Increasing inter-step spacing will improve readability and reduce perceived crowding.

Concrete fixes (apply these as small PRs)

1) Normalize Projects card media and content height (P1)

- CSS (preferred, minimal):

```css
.projects-grid a > .relative.rounded-2xl { display: block; }
.projects-grid .card__media { aspect-ratio: 16/9; width: 100%; background-size: cover; background-position: center; }
.projects-grid .card__content { min-height: 120px; display:flex; flex-direction:column; justify-content:space-between; }

/* utility to reduce variation: force equal card content area */
.projects-grid a > .relative.rounded-2xl { display: grid; grid-template-rows: auto 1fr; }
.projects-grid .meta { min-height: 80px; }
```

- Implementation notes:
  - If images are background-image on the card root, ensure the media container has fixed `aspect-ratio` and `background-size: cover`.
  - If possible, use `<img>` with `loading="lazy"` and `object-fit: cover` for better diagnostics and LCP behavior.

2) Reduce card height variation via content truncation or reserved space (P1)

- Truncate or limit metadata length in the card title/summary to 2 lines on mobile using `line-clamp` or `-webkit-line-clamp`, or reserve consistent metadata area using `min-height`.

3) Increase Process step spacing on mobile (P2)

- CSS:

```css
@media (max-width: 640px) {
  section.process .step-button { margin-bottom: 1rem; padding: 0.75rem 1rem; }
  section.process .step-button { height: auto; min-height: 72px; }
}
```

- Aim: increase inter-step gap from ~8px to at least 16px and reduce the apparent heaviness of each step block.

4) Hero node graph (visual balance) (P2)

- If the hero node graph uses `h-[200px]` on mobile and appears cramped, try either:
  - Slightly increase mobile height to `h-[220px]` and reduce node count/particle effects on mobile; OR
  - Keep `h-[200px]` but simplify visuals (fewer nodes, larger spacing) to maintain perceived clarity.

Observability & testing suggestions
- Add lightweight data hooks to aid audits and future tests:
  - `data-project-card` on the project card root (anchor or inner div)
  - `data-process-step` on each step element
- Re-run the selector-driven audit after applying CSS/markup changes and verify:
  - Card min/max height variation drops below 8px (goal: ≤ 8px)
  - All cards render consistent media aspect ratios
  - Process step gaps ≥ 16px

Quick verification Playwright snippet (example)

```js
// inside test for each width
const cards = await page.$$('main#main-content a[href^="/projects/"]');
const heights = [];
for (const c of cards) heights.push((await c.boundingBox()).height);
console.log(Math.min(...heights), Math.max(...heights));

const steps = await page.$$('section:has-text("How I build") button');
const stepRects = await Promise.all(steps.map(s=>s.boundingBox()));
// compute gaps
```

Recommendation (next action)
- Implement the Projects card CSS fixes (aspect-ratio + reserved content height) and add `data-project-card` hooks. This is high ROI (P1) and low-risk.
- After the small PR, re-run this audit to confirm improvements.
