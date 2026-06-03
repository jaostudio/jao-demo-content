# Component Quality Standards

## Every Component Must Define

### 1. Interaction States

| State | Requirement |
|---|---|
| Default | Visible, readable, meets contrast minimums |
| Hover | Cursor change, subtle visual feedback (scale/border/color) |
| Focus | Visible focus ring (not `outline: none` without replacement) |
| Active | Momentary press feedback (scale 0.97 or color shift) |
| Loading | Skeleton or spinner — never blank or frozen state |
| Disabled | Opacity 0.4, no pointer events, clear visual indication |
| Mobile/Touch | Larger tap targets (min 44×44px), no hover-dependent interactions |

### 2. Performance Rules

- Never trigger unnecessary rerenders (memoize when beneficial)
- Avoid layout thrashing (batch DOM reads/writes)
- Animate only `transform` and `opacity` (GPU-composited properties)
- Use `will-change` sparingly and remove after animation
- No expensive calculations in render functions
- Images: use `next/image` with explicit width/height to prevent CLS
- Lazy-load everything below the fold

### 3. Accessibility Rules

- All interactive elements keyboard-navigable (tab order logical)
- `prefers-reduced-motion` respected (disable Lenis + complex animations)
- Color contrast ratios meet WCAG AA minimum (`#FAFAFA` on `#050505` = 19.7:1 ✓)
- Semantic HTML (`<nav>`, `<section>`, `<button>`, `<a>`, `<h1-h6>`)
- ARIA labels where visual label is absent
- Focus trap for modals/menus
- Touch targets minimum 44×44px on mobile

### 4. Code Structure

```tsx
// Standard component template
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ComponentProps {
  children?: React.ReactNode
  className?: string
  // ... specific props
}

export function Component({ children, className, ...props }: ComponentProps) {
  return (
    <motion.div
      className={cn('base-styles', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

### 5. Responsive Behavior

- Mobile-first by default
- Define desktop as enhancement, not default
- Never hide important content on mobile
- Test at: 360px, 768px, 1024px, 1440px, 1920px

## Section Component Standard

Every homepage section must:

```tsx
// Section template
export function SectionName() {
  return (
    <Section id="section-name">
      <Container>
        <FadeIn>
          {/* Section content */}
        </FadeIn>
      </Container>
    </Section>
  )
}
```

`<Section>` provides: padding, id anchor, optional glow background, optional alternating surface.

## Future-Proofing Rules

- NEVER hardcode project layouts — use Contentlayer + typed data
- NEVER hardcode motion values — use `src/lib/motion/` constants
- NEVER duplicate section logic — compose from primitives
- NEVER mix content with presentation — content in MDX, presentation in components
- ALWAYS use cn() utility for conditional classes
- ALWAYS centralize constants (colors, spacing, timing) in tokens

## Scroll Testing Standards

Since Lenis + Framer Motion power the scroll experience, test on:

- Low-end laptops (integrated GPU, 60hz)
- Mobile Safari (iOS — known Lenis quirks)
- Trackpads (precision vs momentum scrolling)
- 120hz+ displays (ensure smooth at high refresh rates)
- `prefers-reduced-motion: reduce` (falls back to native scroll)

Scroll feel IS part of the brand. If it stutters, the portfolio loses authority.

## Reduced Motion Architecture

Must be built in from the start, not bolted on:

1. Check `useReducedMotion()` from framer-motion at the app level
2. When reduced motion is preferred:
   - Disable Lenis smooth scroll (native scroll only)
   - All animations become instant opacity reveals (no translate/scale/parallax)
   - Disable magnetic cursor
   - Disable parallax effects
   - Keep hover feedback (visual only, no transform)
3. Test every page in reduced motion mode before launch

---

*Last updated: 2026-05-27*
