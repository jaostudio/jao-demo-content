# Density And Navigation Contract

## 1. Purpose

Define how the portfolio should pace content density, project hierarchy, navigation behavior, and mobile interaction intensity.

This document prevents every section from becoming equally loud.

## 2. Current Failure Modes

The portfolio likely carries too many high-energy patterns through the page:
- large cards
- repeated badges
- layered effects
- oversized spacing
- multiple CTAs per section
- motion in many places at once

That produces visual entropy on mobile and weakens scanability.

## 3. Target State

The page should breathe.

Establish explicit density zones and let section energy vary.

Recommended density ladder:
- dense
- minimal
- visual
- technical
- quiet

## 4. Implementation Targets

Primary sources:
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)

Supporting section sources:
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)

## 5. Constraints

Do not:
- keep the same interaction density across all sections
- use oversized overlays or awkward transitions in mobile nav
- preserve desktop card density on narrow screens
- add decorative layers to solve hierarchy issues
- let motion patterns fragment into local one-off effects

Mobile navigation should:
- open instantly
- keep the choice set short
- prioritize the conversion path
- feel restrained and brand-aligned

## Section Intensity Rules

Every major section must declare its mobile intensity profile.

Example structure:

```
Hero:
	density: high
	motion: medium
	interactions: 2

Projects:
	density: medium
	motion: low
	interactions: 1

Process:
	density: low
	motion: minimal
	interactions: 1
```

Rules:
- high density sections must be followed by quieter sections
- motion intensity should drop when content density rises
- interaction count should be explicit per section

## 6. QA Gates

Required validation areas:
- sections feel paced rather than repetitive
- projects are easier to skim quickly
- navigation feels coherent and lightweight
- motion reads as intentional instead of scattered
- no motion stutter or crowding in common mobile viewports

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
- too much compression can make the page feel sparse or unfinished
- too little compression can preserve the current entropy problem
- reducing motion too aggressively can make the interface feel static

Rollback rule:
- preserve desktop visual richness where it already works
- use progressive disclosure for dense mobile sections
- keep CTAs obvious even when other elements are reduced

---

*Last updated: 2026-05-29*

---

*Last updated: 2026-05-29*