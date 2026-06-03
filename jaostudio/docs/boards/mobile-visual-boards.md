# Mobile Visual Boards — quick review

Screenshots captured under `.opencode/screenshots/` (sizes: 360, 390, 412). Use these as the single source for perceptual QA and annotations.

Pages

- Home (hero + featured projects): .opencode/screenshots/root/360.png | 390.png | 412.png
  - Notes: hero compact mode applied. Check H1/CTA visual dominance at 360.

- Projects (list): .opencode/screenshots/projects/360.png | 390.png | 412.png
  - Notes: carousel now uses native horizontal scroll on mobile. Verify swipe behavior on real devices and that card edges aren't clipped.

- Services: .opencode/screenshots/services/360.png | 390.png | 412.png
  - Notes: spacing and typographic scale checks.

- Process: .opencode/screenshots/process/360.png | 390.png | 412.png
  - Notes: scrollytelling steps and button visibility.

- Contact: .opencode/screenshots/contact/360.png | 390.png | 412.png
  - Notes: portal-mounted CTA present; verify safe-area padding and that inputs are reachable while CTA is fixed.

Next steps for .opencode

- Annotate these images with bounding boxes highlighting issues (CTA clipping, crowded hero, card clipping).
- Create per-issue markdown with before/after recommendations and suggested CSS patches.
