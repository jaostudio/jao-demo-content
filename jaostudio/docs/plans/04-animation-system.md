# Animation & Motion System

## Philosophy

Animations must feel: engineered, smooth, intentional, premium.

Do NOT: over-animate, add fake loading, use excessive particles, create laggy WebGL.

## Libraries

- **Framer Motion** — component animations, scroll reveals, page transitions, gestures
- **Lenis** — smooth scrolling, premium feel

## Motion Constants (`src/lib/motion/`)

All centralized — never hardcode motion values in components.

```ts
// durations.ts
export const durations = {
  fast: 0.15, normal: 0.3, slow: 0.5, xl: 0.8, hero: 1.2,
}

// easings.ts
export const easings = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: "spring", stiffness: 100, damping: 20, mass: 0.5 },
}

// transitions.ts
export const transitions = {
  hero: { duration: durations.hero, ease: easings.out },
  section: { duration: durations.slow, ease: easings.out },
  stagger: { staggerChildren: 0.1, delayChildren: 0.2 },
}

// variants.ts
export const variants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
}
```

## Motion Primitives (`src/components/motion/`)

| Component | Effect |
|---|---|
| `<FadeIn>` | Opacity + Y reveal |
| `<Stagger>` | Staggered children |
| `<SlideIn>` | Directional slide + fade |
| `<ScaleIn>` | Scale + opacity |
| `<Parallax>` | Scroll-linked parallax |
| `<Magnetic>` | Magnetic hover effect |

## Animation Map

| Section | Animation |
|---|---|
| Hero (load) | Staggered fade-in + slide-up (badge → headline → desc → CTAs → visual) |
| Hero (scroll) | Scroll-linked transforms, mouse parallax on floating elements |
| Social Proof | Fade-in staggered badges |
| Featured Projects | Slide-in alternating sides |
| Services | Stagger card reveal (scale + fade) |
| Process | Horizontal scroll, cards slide in with progress |
| Tech Credibility | Fade-in + count-up numbers |
| About | Split slide from opposite sides |
| FAQ | Accordion smooth height |
| CTA | Large scale-in cinematic |
| Contact | Staggered form field reveal |

## Lenis Config

```ts
{
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
}
```

Sync Lenis scroll position with Framer Motion's `useScroll`.

## Reduced Motion

- Check `prefers-reduced-motion` via `useReducedMotion()` from Framer Motion
- Disable Lenis smooth scroll when reduced motion is preferred
- Fall back to instant opacity reveals (no translate/scale)
- Respect at system level, not just as a toggle

## Performance Safeguards

- Animate only `transform` and `opacity` (GPU-composited)
- `useInView` with `once: true` to prevent re-triggers
- `will-change: transform` only on actively animating elements
- Disable parallax and heavy animations on mobile
- No animation libraries beyond Framer Motion + Lenis

---

*Last updated: 2026-05-27*
