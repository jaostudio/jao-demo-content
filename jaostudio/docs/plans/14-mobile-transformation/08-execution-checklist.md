# Mobile Transformation Execution Checklist

## 1. Purpose

Translate the mobile transformation doctrine into an implementation checklist that can be executed file by file.

This document is the working contract for Opencode.

## 2. Current Failure Modes

The portfolio currently risks being implemented as a generic responsive cleanup pass.

That would leave the core problem intact:
- desktop density copied into mobile
- too many simultaneous focal points
- motion effects without governance
- hero and project surfaces still carrying desktop composition logic

## 3. Target State

The redesign should be executed as an adaptive presentation architecture program.

Each task must preserve:
- brand language
- motion vocabulary
- premium feel

while changing:
- composition
- density
- interaction policy
- information hierarchy under compression

## 4. Implementation Targets

### Phase 1 Stabilization

Primary files:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)

Task list:
- reduce hero density on mobile
- compress hero vertical rhythm
- make the NodeGraph semantic and information-led
- simplify hero motion on narrow screens
- lower card density in project surfaces
- ensure mobile nav opens instantly and with restrained motion

### Phase 2 Systemization

Primary files:
- [05-responsive-system.md](05-responsive-system.md)
- [06-motion-governance.md](06-motion-governance.md)
- [src/app/globals.css](../../../src/app/globals.css)
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)
- [src/lib/motion-tokens.ts](../../../src/lib/motion-tokens.ts)

Task list:
- implement fluid typography rules
- implement fluid spacing rules
- establish viewport scaling standards
- centralize motion tokens and easing
- define mobile motion reduction rules
- define section intensity rules

### Phase 3 Optimization

Primary files:
- [07-performance-budget.md](07-performance-budget.md)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)

Task list:
- cap blur and shadow usage on mobile
- reduce SVG and animation cost where possible
- lazy-load heavy or secondary visuals
- keep mobile Lighthouse performance above target
- prevent scroll jank and hydration stalls

### Phase 4 Refinement

Primary files:
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)

Task list:
- tune spacing rhythm and density transitions
- refine mobile navigation clarity
- improve project scanability and progressive disclosure
- adjust tablet behavior where mobile rules overshoot

## 5. Constraints

Do not:
- add decorative gradients or motion layers to solve hierarchy problems
- preserve desktop density on mobile
- increase section count without a clear pacing reason
- rely on breakpoint-only scaling as the primary responsive strategy
- introduce uncontrolled animation in any new component work

Implementation must remain aligned to the plan set rules in:
- [01-principles.md](01-principles.md)
- [02-hero-and-graph.md](02-hero-and-graph.md)
- [03-density-and-navigation.md](03-density-and-navigation.md)
- [04-implementation-order.md](04-implementation-order.md)

## 6. QA Gates

Required device tests:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape
- split-screen tablet
- mobile Chrome with expanded URL bar

Required validation areas:
- no horizontal overflow
- CTA visibility above fold
- stable scroll rhythm
- no stacked animation overload
- no unreadable line lengths
- no oversized gaps
- no crowded cards
- no motion stutter

Required runtime checks:
- mobile Lighthouse performance above 90
- CLS near zero
- stable 60fps scrolling on mid-range Android

## 7. Rollback Risks

Potential regressions:
- mobile compression can over-shrink content if hierarchy is not rebuilt carefully
- desktop may become too sparse if responsive rules are applied globally
- motion governance may flatten premium perception if budgets are too strict
- progressive disclosure can hide important information if the default state is too minimal

Rollback rule:
- change one system at a time
- keep desktop cinematic where it already works
- apply the strongest compression on mobile, moderate compression on tablet, and minimal change on desktop

---

*Last updated: 2026-05-29*