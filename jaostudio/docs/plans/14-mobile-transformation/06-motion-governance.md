# Motion Governance Contract

## 1. Purpose

Define a governed motion system for the portfolio.

Motion must become a shared system with explicit budgets, not a collection of component-local effects.

## 2. Current Failure Modes

The current motion architecture likely suffers from:
- component-local timing choices
- inconsistent easing curves
- unbounded stagger chains
- too many simultaneous motion sources
- animation behavior that changes from section to section without policy

## 3. Target State

Motion should feel unified, restrained, and intentional.

It should help users understand hierarchy without creating overload.

## 4. Implementation Targets

Primary source surfaces:
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)
- [src/lib/motion-tokens.ts](../../../src/lib/motion-tokens.ts)

Component surfaces that must consume the shared motion system:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)

## 5. Constraints

Do not:
- introduce new local motion timings without a shared token
- use large parallax or continuous animation on mobile
- stack multiple motion effects in the same viewport without a reason
- animate decorative surfaces just because they can animate

Required motion policy:
- centralized durations
- centralized easings
- shared stagger policy
- reduced-motion support
- viewport-trigger rules
- animation budgets per section

Acceptable motion types:
- fade
- small slide
- opacity transition
- restrained scale

Disallowed on mobile unless explicitly justified:
- parallax
- continuous motion loops
- large multi-axis transforms
- decorative floating motion
- long stagger chains

## 6. QA Gates

Validation areas:
- motion feels consistent across sections
- reduced-motion mode remains usable and legible
- no perceptible motion stutter during scroll
- no section exceeds its animation budget

Required device tests:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape

## 7. Rollback Risks

Potential regressions:
- motion can feel flat if budgets are too strict
- inconsistent adoption can create a split between governed and ungoverned components
- overusing shared variants can make unique sections feel identical

Rollback rule:
- preserve subtle motion where it improves comprehension
- reduce motion intensity first on mobile
- keep desktop motion richer only where it supports the narrative

---

*Last updated: 2026-05-29*