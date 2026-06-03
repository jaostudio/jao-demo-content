# Performance Budget Contract

## 1. Purpose

Define the runtime and visual-performance constraints for the mobile redesign.

The portfolio is becoming visually expensive, so performance must be treated as part of the design system.

## 2. Current Failure Modes

The current experience likely includes performance risks from:
- animated SVGs
- gradients and glow layers
- Framer Motion usage
- heavy shadows
- live previews and screenshots
- iframes or media assets
- hydration-heavy regions

## 3. Target State

The portfolio should remain smooth and stable on mid-range Android devices and common mobile browsers.

Target outcome:
- stable 60fps scrolling
- minimal layout shift
- quick first interaction
- high Lighthouse performance on mobile

## 4. Implementation Targets

Primary source surfaces:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)

Supporting runtime sources:
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)
- [src/lib/motion-tokens.ts](../../../src/lib/motion-tokens.ts)

## 5. Constraints

Do not:
- add GPU-heavy effects to mobile without a measured reason
- keep excessive blur or shadow layers in mobile states
- make SVG complexity unbounded
- load heavy media before it is needed
- expand hydration boundaries unnecessarily

Budget areas:
- animation count per viewport
- blur usage
- SVG complexity
- hydration boundaries
- lazy-loading strategy
- iframe loading rules
- GPU-heavy effect restrictions

Minimum targets:
- mobile Lighthouse performance > 90
- CLS near zero
- stable 60fps scrolling on mid-range Android

## 6. QA Gates

Validation areas:
- Lighthouse mobile performance over target
- no layout shift regressions
- no scroll jank on average hardware
- no deferred content blocking the first meaningful render
- no heavy visual effect introduced without a budget check

Required device tests:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape
- split-screen tablet
- mobile Chrome with expanded URL bar

## 7. Rollback Risks

Potential regressions:
- over-optimizing may remove too much of the premium visual feel
- lazy-loading may delay important content if applied too aggressively
- SVG simplification may weaken the systems aesthetic if overdone

Rollback rule:
- prioritize interaction stability over decorative fidelity on mobile
- keep high-cost effects desktop-only unless they are proven cheap enough for mobile

---

*Last updated: 2026-05-29*