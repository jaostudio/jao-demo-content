# Projects — Annotations (mobile)

Screenshots
- .opencode/screenshots/projects/360.png
- .opencode/screenshots/projects/390.png
- .opencode/screenshots/projects/412.png

High-priority visual issues

1. Carousel swipe/visibility
   - Observation: carousel uses native horizontal scrolling on mobile (`overflow-x-auto`, `snap-x`). Swipe was broken prior to adding `touch-action: pan-x` and `-webkit-overflow-scrolling: touch`.
   - Evidence: `.opencode/screenshots/projects/360.png` shows first card visible with rounded edges; verify swipe on device.
   - Suggested fix: keep `touch-action: pan-x` and `-webkit-overflow-scrolling: touch`. Also ensure no ancestor with `transform` or `overflow:hidden` masks the horizontal scroller.

2. Card clipping & visual rhythm
   - Observation: rounded card corners and the card-right edge appear clipped by the container in some widths; card heights varied before grid fix, producing uneven rhythm.
   - Evidence: `.opencode/screenshots/projects/360.png` shows right edge near container edge with small visible artifact at bottom-left.
   - Suggested fix: ensure container padding (`px-3`) plus card width (`w-[75vw]` or fixed `sm:w-[300px]`) leaves visible gutter; consider reducing card width slightly on the smallest break to avoid clipping (e.g., `w-[72vw]` at ≤360)

3. CTA pill cropping on tiny widths
   - Observation: CTA pill inside card (View Project Sample) is visually large and may appear cropped on extreme narrow widths.
   - Suggested fix: on <=360, make CTA full-width without side paddings or reduce horizontal padding and hide left icon.

Interactive checks
- Swipe the carousel on an actual device; observe momentum and snap. Confirm no JS error in console relating to pointer events.
- Check that `group-hover` UI for desktop controls doesn't interfere with mobile (`opacity` transitions shouldn't hide content).

Implementation notes
- Carousel scroller: `className="flex gap-3 px-3 py-3 snap-x snap-mandatory overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}` is applied.
- Card width: `w-[75vw]` is a good responsive default but adjust for smallest breakpoints to prevent clipping.

Place all annotated before/after screenshots for these fixes under `../boards/projects/` for review.
# Projects — Visual Audit Annotations

Screenshots: `.opencode/screenshots/projects-360x800.png`, `projects-390x844.png`, `projects-412x915.png`

Summary (perceived quality)
- Overall: The Projects grid is content-rich and well-designed, but mobile thumbnails and metadata cause uneven card heights that read as low-polish to clients.

Findings (annotated)
- Card height inconsistency — Priority: High
  - Symptom: Measured min 316px / max 369px across breakpoints (variation up to ~14% at some widths).
  - Perceptual effect: Rows look misaligned; CTAs and card bottoms appear scattered.
  - Suggested fix: Enforce a consistent media aspect ratio (16:9) and reserve a fixed content area using `min-height` for the meta block. Use `line-clamp` to limit text to 2 lines on mobile.

- Image treatment — Priority: Medium
  - Symptom: Images appear applied as backgrounds; focal cropping is inconsistent across cards.
  - Perceptual effect: Thumbnails lack consistency; some show awkward crops.
  - Suggested fix: Prefer `<img>` with `object-fit: cover` and ensure focal points are centered, or standardize `background-position` per card.

- CTA placement and prominence — Priority: Medium
  - Symptom: CTA positions vary relative to card bottoms on some cards.
  - Perceptual effect: Interaction points are not predictable; reduces conversions.
  - Suggested fix: Place CTAs in a consistent location (bottom of card or fixed overlay) with a shared class and size.

- Tap target sizes — Priority: Low
  - Symptom: Some metadata links/buttons have small vertical padding on mobile.
  - Perceptual effect: Harder to tap with thumbs.
  - Suggested fix: Ensure interactive elements meet 44–48px touch target recommendation.

Verification
- After applying fixes, run the selector-driven audit to confirm height variance percentage drops below 10% and visually re-capture screenshots for quick perceptual review.

Notes
- These fixes are low-risk CSS/markup and should be applied after confirming priorities from the visual boards. Focus on perceived alignment and CTA predictability rather than micro DOM numbers.