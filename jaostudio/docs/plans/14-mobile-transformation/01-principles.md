# Mobile Presentation Principles

## 1. Purpose

Define the mobile presentation architecture for the portfolio.

This document establishes the rules that prevent desktop density from being copied into mobile layouts.

## 2. Current Failure Modes

The current system likely exhibits these mobile risks:
- visual entropy from too many simultaneous focal points
- oversized section rhythm
- high motion count across many components
- inconsistent spacing under viewport compression
- decorative layers competing with the primary message
- weak scanability on narrow screens

## 3. Target State

Mobile should read as a premium operating system rather than a compressed desktop showcase.

The mobile system must optimize for:
1. comprehension
2. hierarchy
3. scanability
4. interaction clarity
5. speed perception

## 4. Implementation Targets

Primary sources:
- [src/components/sections/hero/hero.tsx](../../../src/components/sections/hero/hero.tsx)
- [src/components/system/node-graph.tsx](../../../src/components/system/node-graph.tsx)
- [src/components/projects/projects-carousel.tsx](../../../src/components/projects/projects-carousel.tsx)
- [src/components/layout/navbar.tsx](../../../src/components/layout/navbar.tsx)
- [src/components/sections/process-scrollytelling.tsx](../../../src/components/sections/process-scrollytelling.tsx)

Supporting system sources:
- [src/lib/motion-variants.ts](../../../src/lib/motion-variants.ts)
- [src/lib/motion-tokens.ts](../../../src/lib/motion-tokens.ts)

## 5. Constraints

Do not:
- scale desktop layouts down as a strategy
- introduce new decorative gradients or glow layers for mobile
- preserve desktop density on mobile
- add more simultaneous motion layers
- rely on breakpoint jumps alone for typography or spacing

Use:
- fluid typography
- fluid spacing
- density modes
- restrained motion
- adaptive content priority

## 6. QA Gates

Required devices and viewport conditions:
- 360x800
- 390x844
- 412x915
- 768x1024 portrait
- 1024x768 landscape
- split-screen tablet
- mobile Chrome with expanded URL bar

Validation areas:
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
- desktop layouts may become too sparse if mobile rules are applied globally
- line-length constraints may over-compress text if max widths are too aggressive
- motion reduction may flatten the premium feel if taken too far
- density reduction may make section separation too weak on tablet

Rollback rule:
- keep desktop cinematic where it already works
- apply the strongest compression on mobile
- apply moderate compression on tablet
- preserve minimal change on desktop

---

*Last updated: 2026-05-29*

---

*Last updated: 2026-05-29*