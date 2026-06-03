# Home (Hero) — Annotations (mobile)

Screenshots
- .opencode/screenshots/root/360.png
- .opencode/screenshots/root/390.png
- .opencode/screenshots/root/412.png

High-priority visual issues

1. Hero visual hierarchy
   - Observation: node-graph competes with the H1 and primary CTA on small viewports. Compact mode applied to reduce motion and node count on mobile.
   - Evidence: `.opencode/screenshots/root/360.png` shows the node graph occupying a similar vertical area to the heading.
   - Suggested fix: ensure `compact` mode is the default at ≤767px and increase whitespace above/below textual content so h1 retains visual dominance.

2. CTA sizing and placement
   - Observation: hero CTAs may be narrow on very small widths due to side paddings and layout choices.
   - Suggested fix: make primary hero CTA `w-full max-w-[320px]` on narrow breakpoints and increase `py` for touch comfort.

Performance checks
- Confirm compact node-graph removes animation-related CPU usage on mobile; run Lighthouse on mobile emulation to verify LCP and main-thread time.

Implementation notes
- `src/components/sections/hero/hero.tsx` passes `compact={isMobile}` to `DynamicNodeGraph` and increased mobile graph height to `h-[220px]` — keep this pattern and revisit spacing tokens.
# Home — Visual Audit Annotations

Screenshots: `.opencode/screenshots/home-360x800.png`, `home-390x844.png`, `home-412x915.png`

Summary (perceived quality)
- Overall: Feels high-quality but several mobile breakpoints show hierarchy and density problems that reduce trust and clarity on first glance.

Findings (annotated)
- Hero — Priority: High
  - Symptom: Node graph draws visual attention away from the value proposition on the smallest breakpoint (360). CTA and short summary compete with decorative motion.
  - Perceptual effect: First sentence reads as decorative; user may not know what the site is within 3 seconds.
  - Suggested fix: Reduce hero visual weight on mobile (either increase hero height to ~220px or simplify the node graph: fewer nodes, disable particles). Raise CTA visually (more contrast, larger hit area).

- Hero CTA placement — Priority: Medium
  - Symptom: Primary CTA is lower on the hero on 360; on some screenshots it sits near the fold.
  - Perceptual effect: Primary action is harder to reach with thumb.
  - Suggested fix: Move CTA above fold across mobile breakpoints; increase size and contrast.

- Value Prop / Headline contrast — Priority: Medium
  - Symptom: Headline weight and line-height fold too quickly on narrow widths; background graphic competes for attention.
  - Perceptual effect: Headline doesn't anchor the page immediately.
  - Suggested fix: Slightly increase font-size or weight at 360; reduce background opacity.

- Process (How I build) — Priority: Medium
  - Symptom: Step buttons are tall (~105px) with small vertical gaps (~8–12px).
  - Perceptual effect: Scrolling feels heavy; steps take too much vertical space and feel bulky.
  - Suggested fix: Decrease min-height to ~72px and increase vertical gap to 16px. Reduce visual weight of step backgrounds.

- Project preview (on Home) — Priority: High
  - Symptom: Project cards previewed on the Home appear crowded; images are small and card bottoms are visually uneven.
  - Perceptual effect: Portfolio looks inconsistent; reduces perceived polish.
  - Suggested fix: Use fixed `aspect-ratio` for thumbnails (16:9), reserve content height, and clamp title/summary to 2 lines.

- Density / whitespace — Priority: Medium
  - Symptom: Several sections have tight vertical spacing; smaller breakpoints show compressed content.
  - Perceptual effect: Page feels dense; eyes have no easy rest.
  - Suggested fix: Adopt a 4/8/16/24 vertical scale and apply larger gaps between major sections on mobile.

Quick verification steps
- After changes, re-capture the three mobile screenshots and confirm:
  - Primary headline visible within top 25% of viewport.
  - Primary CTA visible and above fold at 360.
  - Node graph simplified or hero height increased and headline contrast improved.

Notes
- These are perception-first observations — avoid changes that only fix DOM metrics without improving what the user sees. Start with hero hierarchy and project card polish (high ROI).