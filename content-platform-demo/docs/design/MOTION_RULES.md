# Motion Rules

## Philosophy

Motion must clarify hierarchy or state. Decoration-only motion is discouraged.

## Default Approach

```
- CSS transitions for simple state changes.
- IntersectionObserver for reveal-on-scroll.
- No Framer Motion unless explicitly approved.
```

## Transition Defaults

| Property | Duration | Easing |
|---|---|---|
| Opacity | 200ms | ease |
| Transform | 250ms | ease-out |
| Background color | 200ms | ease |
| Box shadow | 200ms | ease |
| Height/Width | 300ms | ease-in-out |

## Scroll-Triggered Reveal

```
- Use IntersectionObserver with threshold 0.1–0.2.
- Animate opacity + translateY(20px → 0).
- Stagger delay between items: max 80ms.
- Do not animate elements that are already visible on load.
```

## State Change Motion

```
- Hover: transition within 200ms.
- Focus-visible: instant or 100ms.
- Modal open: scale 0.95→1 + fade in, 250ms.
- Modal close: scale 1→0.95 + fade out, 200ms.
- Page transitions (if any): 300ms crossfade.
```

## Page Load Motion

```
- Critical content appears immediately (no animation delay for above-fold content).
- Secondary content may fade in, but within 400ms of load.
- No motion that delays interaction readiness.
```

## Reduced Motion

```
- All motion must respect `prefers-reduced-motion: reduce`.
- When reduced motion is detected:
  - No animations.
  - No parallax.
  - No scroll-triggered reveals.
  - Elements appear immediately.
```

## Prohibited Patterns

```
- Layout-shifting animation.
- Parallax backgrounds that affect readability.
- Continuous looping animations (spinners excepted for loading).
- Motion that triggers vestibular disorders (rapid flashes, large scale changes).
- Decoration-only entrance animations.
- Hover animations that cause layout shift.
```

## Justification Required

These patterns require written approval in the design contract:

```
- Framer Motion or any animation library beyond CSS.
- Spring physics-based animations.
- SVG path animations.
- Canvas or WebGL animations.
- Scroll-triggered parallax.
- 3D transforms or perspective shifts.
```
