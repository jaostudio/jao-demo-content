# Prioritized Mobile Issues (2026-05-30)

This list ranks perceptual visual issues by **visibility to clients**, **frequency across pages**, and **ease of fix**. Start with high-visibility, low-effort items.

1) Hero hierarchy & CTA visibility
- Visibility: High
- Frequency: Home, About (lead-ins)
- Ease: Low–Medium
- Impact: High
- Recommendation: Reduce hero visual weight on mobile (simplify node graph or raise hero height to ~220px), increase headline contrast and move primary CTA above the fold. Quick PR: add mobile-only class to reduce node render and increase CTA padding/size.

2) Projects — card alignment & media consistency
- Visibility: High
- Frequency: Projects, Home (project previews)
- Ease: Low
- Impact: High
- Recommendation: Enforce `aspect-ratio: 16/9` for media, use `object-fit: cover` for `<img>` or `background-size: cover`, reserve a `min-height` for meta area, and clamp text to 2 lines on mobile. Quick PR: CSS snippets (aspect-ratio + min-height + line-clamp) + add `data-project-card` attribute.

3) Services — offerings clarity
- Visibility: High
- Frequency: Services
- Ease: Medium
- Impact: High
- Recommendation: Surface short outcome/price label at card top, standardize CTA location and style. Quick PR: add top label slot and unified button class.

4) Contact — primary CTA & form touch targets
- Visibility: High
- Frequency: Contact page
- Ease: Low
- Impact: High
- Recommendation: Move primary CTA above the fold on mobile, increase input height and spacing to meet 44–48px touch targets. Quick PR: mobile-first CSS for form fields + sticky CTA.

5) Process scrollytelling spacing
- Visibility: Medium
- Frequency: Home
- Ease: Low
- Impact: Medium
- Recommendation: Reduce step min-height to ~72px, increase inter-step gap to >=16px, and reduce background weight. Quick PR: media query with spacing adjustments.

6) Density & vertical rhythm
- Visibility: Medium
- Frequency: Site-wide
- Ease: Medium
- Impact: Medium–High
- Recommendation: Adopt vertical spacing scale (8/16/24/32) and apply increased outer section padding on mobile. Quick PR: utility classes and a few targeted spacing updates.

7) Alignment drift & CTA predictability
- Visibility: Medium
- Frequency: Projects, Services, Home
- Ease: Low
- Impact: Medium
- Recommendation: Audit left-alignment of section starts and CTA baselines; enforce consistent card content alignment and CTA placement via shared layout classes.

Verification plan (quick)
- Apply 1–4 as separate small PRs (one PR per area). For each PR: re-capture the three mobile screenshots and verify perceptual improvements by eye and via the selector-driven metrics (height variance % < 10% for Projects).

Next steps
- After approval, implement high-priority PRs in this order: Projects (2), Hero (1), Contact (4), Services (3). Re-run the audit and produce the summary report.
