# Implementation Order

## 1. Purpose

Define the rollout sequence for the mobile presentation architecture.

The order should stabilize hierarchy first, then install responsive infrastructure, then optimize runtime, then refine interactions.

## 2. Current Failure Modes

If the current work is approached as generic responsive cleanup, the implementation will likely:
- compress desktop layouts instead of redesigning mobile composition
- leave motion scattered across components
- preserve too much section density
- fail to enforce performance constraints early enough

## 3. Target State

The transformation should progress through four phases:
1. Stabilization
2. Systemization
3. Optimization
4. Refinement

## 4. Implementation Targets

Phase 1 Stabilization:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)

Phase 2 Systemization:
- [05-responsive-system.md](05-responsive-system.md)
- [06-motion-governance.md](06-motion-governance.md)

Phase 3 Optimization:
- [07-performance-budget.md](07-performance-budget.md)
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)

Phase 4 Refinement:
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)

## 5. Constraints

Do not:
- solve hierarchy problems only by scaling things down
- widen the scope before the current phase is validated
- change desktop cinematic behavior unless the mobile fix requires it
- merge motion, spacing, and performance work into one opaque patch

## 6. QA Gates

Required viewports:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape
- split-screen tablet
- mobile Chrome with expanded URL bar

Required validation areas:
- no horizontal overflow
- CTA visibility above the fold
- stable scroll rhythm
- no stacked animation overload
- no unreadable line lengths
- no oversized gaps
- no crowded cards
- no motion stutter

## 7. Rollback Risks

Potential regressions:
- desktop may become too sparse if mobile rules are made global
- mobile may become overly bare if density is reduced without hierarchy control
- motion budgets may flatten the premium feel if they are too strict

Rollback rule:
- make changes in small reversible slices
- keep desktop cinematic where it already works
- keep mobile compression stronger than tablet compression

## Phase Sequence

### Phase 1 — Stabilization

Goal:
reduce overload without redesigning the entire site.

Includes:
- mobile spacing compression
- hero simplification
- motion reduction
- graph reduction
- typography stabilization

### Phase 2 — Systemization

Goal:
introduce responsive infrastructure.

Includes:
- fluid spacing
- clamp typography
- motion governance
- responsive layout contracts

### Phase 3 — Optimization

Goal:
improve runtime and perception quality.

Includes:
- performance budgets
- adaptive rendering
- lazy loading
- GPU reduction
- reduced-motion system
- animation profiling

### Phase 4 — Refinement

Goal:
polish interaction quality.

Includes:
- pacing adjustments
- spacing refinement
- navigation polish
- microinteraction tuning
- tablet optimization

---

*Last updated: 2026-05-29*