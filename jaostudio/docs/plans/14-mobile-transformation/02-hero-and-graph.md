# Hero And Graph Architecture

## 1. Purpose

Define the mobile hero composition and the semantic role of the NodeGraph.

The hero is the first and strongest perception signal. If it fails under compression, the portfolio reads as visually unstable and less production-grade.

## 2. Current Failure Modes

The current hero likely exposes too many priorities at once:
- graph
- typography
- gradients
- badges
- metadata
- animations
- CTA clusters

On mobile this produces:
- comprehension delay
- reduced CTA visibility
- visual overload
- unstable focal points

## 3. Target State

Mobile hero target:
1. concise value proposition
2. primary CTA
3. secondary CTA
4. compact supporting visual

Desktop target:
- headline + graph side-by-side
- expanded motion
- ambient effects
- supporting metadata

The graph must become semantic and systems-oriented, not decorative.

## 4. Implementation Targets

Primary sources:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)

Supporting motion source:
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)

## 5. Constraints

Do not:
- stack hero content as a compressed desktop column
- keep all decorative layers visible at once on mobile
- let the NodeGraph read as random floating nodes
- use the hero to solve hierarchy problems only through scaling

The graph should imply:
- architecture visualization
- deployment topology
- automation pipeline
- service orchestration map

## 6. QA Gates

Required checks:
- mobile hero value proposition is visible immediately
- CTA remains above the fold on target devices
- NodeGraph reads as information within 3 seconds
- no unreadable line wrapping on 360px devices
- no overlap between copy and supporting visual

Test widths:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape

## 7. Rollback Risks

Potential regressions:
- over-compression could make the hero feel generic
- reducing graph motion too far could weaken technical credibility
- headline clamp values could cause awkward wraps at intermediate widths

Rollback rule:
- preserve the desktop cinematic layout
- keep the graph available, but secondary, on mobile
- if necessary, replace motion with a quieter semantic snapshot on low-power devices

---

*Last updated: 2026-05-29*

---

*Last updated: 2026-05-29*