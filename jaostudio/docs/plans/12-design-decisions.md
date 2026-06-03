# 24 Critical Design Decisions

These are specific, high-leverage design patterns that directly affect perceived expertise, trust, pricing perception, memorability, and conversion quality. Reference during every implementation decision.

---

## 1. Large Typography + Tight Headlines

```css
text-6xl md:text-7xl xl:text-8xl
tracking-tight
leading-[0.9]
font-medium
```
**Why:** Large type signals confidence, clarity, modernity, authority. Small type feels less premium.

**Rule:** Fewer words, stronger hierarchy, larger visual impact.

---

## 2. Offset Layouts Instead of Centered Everything

Avoid centered-everything — looks templated and low-end.

Use: asymmetric grids, offset compositions, overlapping elements, layered layouts.

```
Text aligned left
Visual offset right
Floating cards overlapping
Background glow offset
```

---

## 3. Cinematic Vertical Spacing

```css
py-32 md:py-40
gap-24
```

**Why:** Premium sites breathe. Compressed layouts feel rushed, amateur, template-based.

---

## 4. Glass Surfaces — Extremely Restrained

**Correct:**
```css
background: rgba(255,255,255,0.03)
backdrop-blur: 12px
border: 1px solid rgba(255,255,255,0.08)
```

**Wrong:** Giant frosted panels, heavy blur, neon borders, opaque cards everywhere.

Max 2 glass elements per page (navbar + optional card).

---

## 5. Subtle Grid Backgrounds

Low-opacity grid, dot matrix, or radial lines. Creates "engineering atmosphere" without screaming "developer portfolio."

---

## 6. Large Project Mockups

Small screenshots destroy perceived value. Use massive cinematic previews: browser mockups, angled perspective, floating desktop+mobile pairs, layered UI presentation.

---

## 7. Glow Only Around Important Elements

Use glow on: primary CTA, hero visual, active interaction, highlighted metric.

Avoid: glowing entire page, glowing text everywhere, rainbow glow.

---

## 8. Border Systems Instead of Heavy Shadows

```css
border: 1px solid rgba(255,255,255,0.08)
```

Premium UIs use soft borders instead of huge shadows. Feels cleaner, more technical, more modern.

---

## 9. Layered Depth

Flat layouts feel cheap. Always compose: foreground → midground → background.

```
background glow → grid texture → surface card → floating card → tooltip overlay
```

---

## 10. Motion Should Feel Physical

**Good:** weighted, intentional, responsive (spring physics, subtle parallax, stagger reveals, scroll transforms, magnetic hover).

**Bad:** floaty, random, over-eased, excessive.

Motion should guide attention — not show off.

---

## 11. Hero Visual — Real Product Depth

```
main browser mockup
+ floating analytics card
+ mobile preview
+ metrics badge
+ subtle motion
```

Creates "high-end product designer" perception.

---

## 12. Thin Dividers

```css
border-white/5
```

Use between sections, cards, metrics, content groups. Creates rhythm.

---

## 13. Low-Saturation Surfaces

```css
surface: #111111, #151515, rgba(255,255,255,0.03)
```

Preserves visual calmness. No bright cards, high contrast panels, or neon sections.

---

## 14. Controlled Visual Density

Every viewport gets **one dominant focal point**. Not 12 animations, 5 glowing cards, multiple CTAs, excessive badges.

Premium design = focused attention.

---

## 15. Subtle Noise Texture

Very faint film grain or noise overlay. Removes "sterile digital flatness." Creates depth, tactility, cinematic feel.

---

## 16. Strong Visual Hierarchy

Clients should instantly know where to look, what matters, what to click.

```
Headline → Featured Visual → CTA → Supporting Copy → Secondary Details
```

---

## 17. Sections as Scenes

Each section has its own atmosphere:
- Hero = cinematic
- Projects = immersive
- Process = structured
- About = personal
- CTA = energetic

---

## 18. Signature Shapes

Consistent radius, corner cuts, borders, padding rhythm, glow behavior.

```css
rounded-3xl  /* 24px — large radii feel modern, premium */
```

---

## 19. Responsive Typography Scaling

```css
font-size: clamp(3rem, 8vw, 7rem);
```

Avoid huge desktop typography that shrinks poorly.

---

## 20. Premium CTA Design

Depth, hover motion, subtle glow, tactile interaction, strong spacing.

```
slight lift on hover
border shimmer
soft glow pulse
```

---

## 21. Luxurious Scrolling

Lenis tuned carefully: duration, lerp, wheel multiplier, touch multiplier.

Should feel fluid, weighted, cinematic — not slippery, laggy, or disconnected.

---

## 22. No Developer Portfolio Tropes

Do NOT use: floating code snippets, giant terminal windows, spinning cubes, matrix effects, coding animations. Instantly reduces sophistication.

---

## 23. Realistic Content Density

Show more, say less. Concise copy, strong visuals, metrics, structure. No giant paragraphs.

---

## 24. One Truly Exceptional Section

One section should make users think "How was this built?" This creates memorability.

---

## Design Philosophy

```
Your design should communicate:
  precision · restraint · confidence · craftsmanship
  technical sophistication · premium execution

NOT: trying too hard to look impressive

Premium portfolios feel:
  calm · controlled · intentional
```

---

*Last updated: 2026-05-27*
