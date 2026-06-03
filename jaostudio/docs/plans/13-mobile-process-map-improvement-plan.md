# Mobile Process Map Improvement Plan

## Scope
Reduce the visual footprint of the Process Map section on small screens while preserving desktop layout, readability, and interaction behavior.

Primary target component:
- src/components/sections/process-scrollytelling.tsx

## Problem Summary
On mobile, the Process Map block appears too tall and visually dense.
Current issues:
- Panel minimum height is too large for common viewport heights.
- Card paddings and spacing consume too much vertical space.
- Number badges and text rhythm are oversized for compact viewing.
- The active detail panel spacing causes long scroll before the next section.

## Goals
1. Make the Process Map feel materially smaller on mobile (aggressive compact pass).
2. Keep desktop and tablet visual balance unchanged.
3. Preserve accessibility, touch usability, keyboard navigation, and auto-advance behavior.
4. Avoid content rewrite and logic changes unless required by layout constraints.

## Non-Goals
- No redesign of process content, sequence, or messaging.
- No animation overhaul.
- No changes to unrelated sections or global typography scale.

## Implementation Strategy
Use mobile-first class adjustments in the Process Map component, then restore current values at md and lg breakpoints.

### Workstream A: Container Footprint
Adjust the outer Process Map container and both panel wrappers.

Planned changes:
- Reduce mobile min-height clamp for the grid container.
- Reduce mobile padding in the left map panel.
- Reduce mobile padding in the right active-step panel.
- Keep existing md and lg values to prevent desktop regressions.

Expected outcome:
- Immediate reduction in panel height and above-the-fold dominance.

### Workstream B: Step Card Density
Adjust ProcessPreviewButton sizing for mobile.

Planned changes:
- Decrease mobile card padding.
- Shrink number badge dimensions slightly.
- Reduce mobile title/meta text size by one step where needed.
- Preserve comfortable tap target size and visible selected state.

Expected outcome:
- Five-step list appears tighter and less heavy without becoming cramped.

### Workstream C: Active Panel Rhythm
Tighten internal spacing in the active step detail section.

Planned changes:
- Reduce vertical gap spacing between major blocks.
- Decrease top margins for summary and detail text blocks.
- Slightly reduce deliverable pill padding and internal gaps.
- Keep progress and CTA readable and reachable.

Expected outcome:
- Content remains clear but consumes less vertical space on mobile.

### Workstream D: Guardrails
Preserve behavior and accessibility.

Checks:
- Arrow key navigation still works.
- Auto-advance timing remains unchanged.
- Focus pause/resume behavior remains unchanged.
- No clipping, overlap, or horizontal overflow at narrow widths.

## Suggested Change Sequence
1. Container min-height and panel paddings.
2. Step list card compaction.
3. Active panel rhythm compaction.
4. Visual QA pass on mobile widths.
5. Regression check on md and lg.

## QA Plan
Test viewports:
- 360x800
- 390x844
- 430x932
- 768x1024 (tablet sanity)
- 1280+ desktop sanity

Validation checklist:
- Process Map no longer dominates mobile viewport.
- All five cards remain legible and tappable.
- Active card state remains prominent and clear.
- Deliverables, progress, and CTA remain readable.
- No motion or interaction regressions.
- md and lg still match original visual intent.

## Acceptance Criteria
1. Mobile panel height feels visibly smaller (target: about 20 percent compactness).
2. No readability or tap usability regressions.
3. No desktop/tablet regressions.
4. No TypeScript/runtime issues introduced.

## Risks and Mitigations
Risk: Over-compression harms readability.
Mitigation: Keep typography reductions minimal and prioritize spacing reductions first.

Risk: Selected-state visual hierarchy weakens.
Mitigation: Preserve border/glow treatment and contrast for active cards.

Risk: CTA crowding near progress row.
Mitigation: Keep CTA row spacing slightly larger than surrounding compressed blocks.

## Rollout Notes
- This can ship as a single focused UI patch.
- If needed, add follow-up fine-tuning after live-device review.

## Deliverable
A mobile-focused adjustment plan compiled in .opencode/plans and ready for implementation when approved.
