# Responsive System Contract

## 1. Purpose

Define the responsive infrastructure for the mobile presentation system.

This document replaces breakpoint-only thinking with a fluid presentation model.

## 2. Current Failure Modes

The current layout system likely relies too heavily on breakpoint scaling, which causes:
- awkward intermediate widths
- oversized spacing on tablets
- unstable typography wrapping
- desktop density being preserved too long on mobile
- content priority staying too static across devices

## 3. Target State

The responsive system should adapt presentation density, spacing, and hierarchy fluidly across viewports.

It should feel intentional at:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape
- split-screen tablet modes

## 4. Implementation Targets

Primary source surfaces:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)

Supporting system sources:
- [src/app/globals.css](../../../src/app/globals.css)
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)
- [src/lib/motion-tokens.ts](../../../src/lib/motion-tokens.ts)

## 5. Constraints

Do not:
- rely on `sm`, `md`, `lg` breakpoints as the only scaling model
- solve typography with fixed breakpoint jumps alone
- keep desktop spacing unchanged on mobile
- use scaling as a substitute for hierarchy redesign

Required standards:
- fluid typography via `clamp()`
- fluid spacing via `clamp()`, `min()`, or `max()` where appropriate
- content max widths for readable line lengths
- explicit collapse rules for cards, grids, and hero layout
- responsive content priority that changes by device class

## 6. QA Gates

Validation areas:
- no horizontal overflow
- no unreadable line lengths
- no oversized mobile gaps
- no crowded card stacks
- no desktop regression from fluid rules

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
- fluid values can over-compress text if the lower bounds are too small
- fluid spacing can create inconsistent rhythm if min/max values are too wide apart
- responsive collapse rules can break if applied too aggressively to desktop layouts

Rollback rule:
- apply fluid behavior only where it improves hierarchy stability
- keep desktop composition stable while adjusting smaller viewports

---

*Last updated: 2026-05-29*