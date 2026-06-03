# About — Visual Audit Annotations

Screenshots: `.opencode/screenshots/about-360x800.png`, `about-390x844.png`, `about-412x915.png`

Summary (perceived quality)
- Overall: The About page communicates credibility but has density and rhythm issues on mobile that reduce quick-scannability.

Findings (annotated)
- Hero / Lead-in — Priority: Medium
  - Symptom: Intro paragraph stacks into a long block on 360; image and text compete for vertical space.
  - Perceptual effect: Users may skip the bio; trust signal loses emphasis.
  - Suggested fix: Break intro into a 1-line hook + 1-line supporting sentence, hide less-critical badges on smallest breakpoints.

- Trust signals (logos/testimonials) — Priority: Medium
  - Symptom: Logos are small and tightly packed; some collapse into multiple rows.
  - Perceptual effect: Proof is present but not immediately legible.
  - Suggested fix: Increase logo size, reduce quantity shown on mobile (show 3 max), use carousel or overflow.

- Long-form paragraphs — Priority: Medium
  - Symptom: Dense paragraph blocks with small line-height.
  - Perceptual effect: Reading fatigue on mobile.
  - Suggested fix: Increase line-height and add subtle section separators (padding + background tone).

- CTA visibility — Priority: Low
  - Symptom: Secondary CTAs blend with body text and are not visually distinct on smaller widths.
  - Suggested fix: Make CTA button prominent and sticky on scroll if appropriate.

Verification
- Re-capture after changes and ensure lead-in hook visible within top 30% and logos remain legible.