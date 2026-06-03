# Services — Annotations (mobile)

Screenshots
- .opencode/screenshots/services/360.png
- .opencode/screenshots/services/390.png
- .opencode/screenshots/services/412.png

Observed issues

1. Section density & line-length
   - Observation: service cards and lists feel dense at 360; body copy lines wrap early and create visual clutter.
   - Suggested fix: increase vertical rhythm by 8–12px at ≤360 (use `space-y-4` → `space-y-5` for lists or bump `py` on service items).

2. Button visibility and hit area
   - Observation: some secondary CTAs are small on mobile; ensure `h-12` / `min-h-[44px]` for mobile buttons.
   - Suggested fix: make CTA `size="lg"` or apply `className="h-12"` at mobile breakpoints.

3. Visual separation of sections
   - Observation: dividers and subtle borders can lose contrast on small screens.
   - Suggested fix: slightly increase `border-opacity` or add micro-shadow on touchable items to increase separation without changing the overall look.

Interactive checks
- Tap each CTA to confirm hit area and spacing with keyboard open.
- Validate that the service list remains scrollable and doesn't trap vertical scroll inside nested containers.
# Services — Visual Audit Annotations

Screenshots: `.opencode/screenshots/services-360x800.png`, `services-390x844.png`, `services-412x915.png`

Summary (perceived quality)
- Overall: Service offerings are clear but could convert faster with improved scannability and clearer pricing/packaging signals on mobile.

Findings (annotated)
- Offerings clarity — Priority: High
  - Symptom: Service cards stack with similar visual weight; pricing or deliverable cues are not prominent on mobile.
  - Perceptual effect: Visitors must read into cards to know what they can buy.
  - Suggested fix: Add a short label or price hint at the card top (e.g., "Website: from $X"), bold the outcome.

- Button predictability — Priority: Medium
  - Symptom: CTA buttons across service cards vary in color/placement.
  - Perceptual effect: Interaction expectation inconsistent.
  - Suggested fix: Standardize CTA styles and place them at a consistent location (bottom of card)

- Visual density — Priority: Medium
  - Symptom: Multiple pills/badges/icons create visual noise on small screens.
  - Perceptual effect: Reduces clarity of the offering.
  - Suggested fix: Limit visible badges to the most important one or collapse extras behind a "info" affordance.

Verification
- After tweaks, check that each service card communicates “what you get” in one glance and that CTA location is consistent across cards.