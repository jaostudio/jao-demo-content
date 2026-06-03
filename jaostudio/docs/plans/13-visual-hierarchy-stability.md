# Visual Hierarchy Stability Plan

## Positioning Goal

Shift the portfolio from a desktop-first cinematic showcase into a system intentionally composed for progressive density scaling.

The product should communicate:
- layout discipline
- spacing consistency
- information compression
- interaction restraint
- motion control
- readability under constrained viewports

## Problem Statement

The current audit correctly identifies responsiveness issues, but it misses the deeper conversion risk:

The site is visually optimized for large screens and then compressed, rather than designed from a hierarchy system that stays stable as the viewport narrows.

That creates perception drift:
- premium on desktop
- busy on mobile
- less disciplined on tablets
- less production-grade under compression

## Core Principle

Design the experience as a density system, not a single layout.

Desktop can remain cinematic.
Mobile and tablet must become progressively more restrained, more legible, and more intentional.

## Primary Risks To Address

1. Hero overload on mobile.
2. Decorative graphs reading as noise instead of systems information.
3. Typography that scales too linearly.
4. Section density that repeats the same high-energy pattern.
5. Project pages that are too uniform to scan quickly.
6. Motion that lacks global governance.
7. Mobile navigation that feels generic and detached from the brand.
8. Performance risk on mid-range mobile hardware.

## Plan Structure

### Phase 1: Stabilize Perception

Goal: make the first impression feel more controlled and more engineer-led.

Work items:
- Compress the hero on mobile.
- Reduce motion density in the above-the-fold region.
- Reframe the NodeGraph so it reads as system information, not decoration.
- Introduce typography clamps for headline and supporting copy.
- Reduce vertical padding and spacing on small screens.

Success criteria:
- The hero communicates the value proposition in the first screen.
- The graph feels purposeful within 3 seconds.
- Mobile no longer feels like a shrunk desktop composition.

### Phase 2: Improve Scanability

Goal: make the site easier to parse as a professional systems portfolio.

Work items:
- Establish density variance across sections.
- Introduce quieter sections between visually heavy sections.
- Reduce repeated card/CTA patterns.
- Create a clearer project hierarchy with featured, systems, and experimental tiers.
- Improve content compression for small screens.

Success criteria:
- Users can identify section purpose without re-reading.
- Projects page scans in tiers rather than as a flat gallery.
- Mobile scroll feels paced, not overloaded.

### Phase 3: Production Polish

Goal: formalize motion, performance, and interaction behavior.

Work items:
- Centralize motion tokens and easing rules.
- Enforce reduced-motion behavior consistently.
- Establish an animation budget.
- Profile mobile performance on average hardware.
- Tighten lazy-loading and asset strategy.
- Review navigation interaction patterns for brand coherence.

Success criteria:
- Motion feels unified across the site.
- The experience remains smooth on mid-range devices.
- Navigation reinforces the systems-builder positioning.

## Section-Level Recommendations

### Hero

Mobile hierarchy:
1. Headline
2. Subheadline
3. Primary CTA
4. Secondary CTA
5. Compact graph
6. Trust indicator

Desktop hierarchy:
1. Headline + graph side-by-side
2. Expanded motion
3. Ambient effects
4. Supporting metadata

Implementation intent:
- Make mobile text-first.
- Keep the graph secondary on small screens.
- Reduce motion and ambient layers on mobile.

### NodeGraph

Current risk:
- It may be read as a decorative animation.

Desired direction:
- Present it as an information system.
- Frame it as topology, request flow, deployment pipeline, or automation orchestration.

Recommended semantic themes:
- Client → Frontend → API Layer → Queue → Workers → Database
- Deployment events and latency indicators
- Live system topology with pulse states

Success criteria:
- The graph immediately reinforces technical credibility.
- The visual reads as architecture, not ornament.

### Typography

Use responsive scaling that accounts for mobile compression rather than simple breakpoint jumps.

Rules:
- Prefer `clamp()` for hero headings.
- Constrain headline measure with max width.
- Tighten line-height on small screens.
- Prevent unstable wrapping on narrow devices and landscape phones.

Success criteria:
- No orphaned words or oversized stacks.
- Headline remains controlled across common phone widths.

### Section Density

Introduce explicit density zones:
- dense
- minimal
- visual
- technical
- quiet

Rules:
- Not every section should have the same visual energy.
- Avoid repeating the same pattern of headline, subheadline, cards, badges, effects, animations, CTA.
- Use separation and contrast to create pacing.

Success criteria:
- The page feels composed, not accumulated.
- Visual peaks become meaningful.

### Projects Page

Tiered layout recommendation:
- Tier 1: Featured projects with a larger cinematic treatment.
- Tier 2: Systems projects with medium cards.
- Tier 3: Experiments with compact rows or lists.

Success criteria:
- Projects are easier to skim.
- The page signals depth and discernment instead of uniformity.

### Motion System

Create a governed motion language instead of component-local ad hoc animation.

Tokens to centralize:
- durations
- easing curves
- stagger timing
- viewport trigger rules
- reduced-motion fallbacks

Expected output:
- consistent feel
- fewer timing mismatches
- lower cognitive noise

### Mobile Navigation

Avoid default-feeling mobile navigation patterns where possible.

Preferred direction:
- restrained overlay
- systems-console metaphor
- command-palette style interaction
- minimal transitions with clear hierarchy

Success criteria:
- Navigation feels coherent with the rest of the engineering-led brand.

### Performance

Treat performance as part of the visual hierarchy problem.

Concerns:
- animated SVGs
- gradients and glow layers
- Framer Motion usage
- shadows and overlays
- live previews and screenshots

Rules:
- Mobile must stay smooth on average hardware.
- Motion should enhance comprehension, not hide jank.
- Audit and budget any animation-heavy region.

## Implementation Order

1. Hero compression.
2. NodeGraph semantic reframing.
3. Typography clamp system.
4. Section density normalization.
5. Projects hierarchy tiers.
6. Motion governance.
7. Mobile navigation refinement.
8. Performance profiling and budget enforcement.

## Acceptance Criteria

The plan is complete when:
- the site feels intentionally designed for mobile density scaling,
- hierarchy remains stable at 360px through desktop widths,
- the graph reads as systems information,
- motion is consistent and restrained,
- the portfolio reads as a production-grade systems engineer rather than a desktop-first showcase.

## Implementation Notes For Opencode

- Favor small, reversible changes.
- Keep desktop cinematic where it already works.
- Apply the strongest compression on mobile, moderate compression on tablet, and minimal change on desktop.
- Treat motion and spacing as part of the conversion architecture, not cosmetic polish.

---

*Last updated: 2026-05-29*