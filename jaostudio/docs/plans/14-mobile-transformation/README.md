# Mobile Transformation Plan Set

## Doctrine

This plan set is an execution-grade architecture spec for the mobile presentation system.

It is not a list of responsive cleanup tasks.

The mobile redesign must preserve brand language and motion vocabulary while changing composition, density, and interaction policy for constrained viewports.

## System Goal

Build a mobile-first presentation system that preserves clarity, hierarchy, and perceived engineering quality under viewport compression.

The mobile experience should feel:
- intentional
- restrained
- production-grade
- highly structured
- performance-aware

It should not feel like:
- a compressed desktop showcase
- an animation-heavy frontend demo
- a visual experiment

## Planning Standards

Every plan document in this set must include:
1. Purpose
2. Current Failure Modes
3. Target State
4. Implementation Targets
5. Constraints
6. QA Gates
7. Rollback Risks

Each document should read like:
- an engineering specification
- a visual system constraint sheet
- an implementation contract
- a QA baseline

## Architectural Principle

Desktop and mobile share brand language, but not identical composition.

Mobile must simplify, reprioritize, and reduce simultaneous visual load before it layers on cinematic detail.

## Plan Map

| File | Focus |
|---|---|
| [01-principles.md](01-principles.md) | Mobile presentation doctrine, hierarchy policy, density modes, anti-goals |
| [02-hero-and-graph.md](02-hero-and-graph.md) | Hero compression contract, NodeGraph semantics, mobile hero layout rules |
| [03-density-and-navigation.md](03-density-and-navigation.md) | Section intensity rules, project hierarchy, navigation restraint, interaction budget |
| [04-implementation-order.md](04-implementation-order.md) | Phase sequencing, QA matrix, acceptance gates, rollback risks |
| [05-responsive-system.md](05-responsive-system.md) | Fluid typography, fluid spacing, viewport scaling, layout collapse rules |
| [06-motion-governance.md](06-motion-governance.md) | Motion tokens, animation budgets, reduced-motion rules, viewport policies |
| [07-performance-budget.md](07-performance-budget.md) | GPU limits, hydration, lazy loading, Lighthouse and frame-rate targets |
| [08-execution-checklist.md](08-execution-checklist.md) | File-by-file implementation checklist, ordering, validation steps, rollback boundaries |

## Primary Source Surfaces

These are the implementation anchors referenced by the mobile transformation plans:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)
- [src/lib/motion-tokens.ts](../../../src/lib/motion-tokens.ts)

## Operating Rule

Mobile should feel like a minimal premium operating system.

It should not feel like a shrunken desktop interface.

---

*Last updated: 2026-05-29*