# Design Contract

## Brand Position

```
[One sentence describing what the brand stands for and how it differs from competitors.]
```

## Visual Tone

```
[Professional / Editorial / Playful / Minimal / Bold / Warm / Technical / Other]
```

## Design Principles

```
1. [Principle]
2. [Principle]
3. [Principle]
```

Example:

```txt
1. Content hierarchy drives layout — spacing and type weight reflect information importance.
2. Every visual element has a purpose — decoration must be justified by product intent.
3. Consistency beats novelty — established patterns are preferred over creative one-offs.
```

## Color Semantics

### Token Definitions

```
- `brand.primary`: primary CTA only.
- `brand.signal`: highlights, review states, demo markers.
- `surface.base`: page background.
- `surface.raised`: cards and panels.
- `border.subtle`: low-contrast structural borders.
- `text.primary`: headings and important body text.
- `text.muted`: secondary explanatory text.
- `status.success`: success states and confirmations.
- `status.error`: error states and destructive actions.
- `status.warning`: warning states.
```

Raw hex values are prohibited outside token definitions.

### Usage Rules

```
- Primary button uses brand.primary. Only one per section.
- Error states use status.error. Never use red for decoration.
- Success states use status.success. Never use green for CTA unless approved.
- Signal color is reserved for demo markers, review indicators, and special annotations.
```

## Typography

| Element | Font | Weight | Size | Line Height |
|---|---|---|---|---|
| Heading 1 | [font] | [weight] | [size] | [lh] |
| Heading 2 | [font] | [weight] | [size] | [lh] |
| Body | [font] | [weight] | [size] | [lh] |
| Small / Caption | [font] | [weight] | [size] | [lh] |
| Mono / Code | [font] | [weight] | [size] | [lh] |

### Typography Rules

```
- Maximum line length: 70 characters for body text.
- Heading hierarchy must be semantic (h1 → h2 → h3).
- No text smaller than 14px for body content.
- Link text must be distinguishable by more than color (underline or icon).
```

## Spacing

| Token | Value | Usage |
|---|---|---|
| space.0 | 0 | None |
| space.1 | 4px | Tight inner padding |
| space.2 | 8px | Compact elements |
| space.3 | 12px | Dense UI |
| space.4 | 16px | Standard padding |
| space.5 | 24px | Section spacing |
| space.6 | 32px | Large gaps |
| space.7 | 48px | Section margins |
| space.8 | 64px | Page sections |
| space.9 | 96px | Major page divisions |

### Spacing Rules

```
- Consistent gap rhythm within component groups.
- Section padding should be symmetrical (same left/right).
- Vertical rhythm should follow a consistent ratio.
```

## Layout Rules

```
- Max content width: [960px / 1200px / 1440px]
- Side padding at mobile: 16px
- Side padding at tablet: 32px
- Side padding at desktop: 64px
- Grid columns: 12-column grid at desktop, 4-column at mobile
- Sticky headers must not exceed 20% of viewport height
- No horizontal overflow at any breakpoint
```

## Component Rules

```
- Pages compose components. Components consume tokens. Tokens define visual language.
- Pages do not invent styling primitives.
- Every component has typed props.
- Every component has variant rules.
- No one-off CTA styles — use Button variants.
- Card border radius, shadow, and padding are defined by tokens, not per-instance values.
```

## Motion Rules

```
- Use CSS transitions for simple state changes.
- Use IntersectionObserver for reveal-on-scroll.
- No Framer Motion unless explicitly approved.
- No layout-shifting animation.
- All motion must respect `prefers-reduced-motion`.
- Motion must clarify hierarchy or state. Decoration-only motion is discouraged.
- Transition duration: 200-300ms for micro-interactions.
- Stagger delay between elements: max 80ms to avoid sluggish feel.
```

## Accessibility Rules

```
- All interactive elements must be keyboard accessible.
- Focus indicators must have 3:1 contrast ratio against background.
- Skip-to-content link present on all pages.
- All images have alt text. Decorative images use alt="".
- Color is never the only differentiator for state or meaning.
- Touch targets minimum 44x44px.
- Form inputs have associated labels.
- Error messages are associated with inputs via aria-describedby.
```

## Responsive Rules

```
- Mobile-first breakpoints: 390px, 768px, 1440px.
- No horizontal scroll at any breakpoint.
- CTA text must not wrap at 390px.
- Tables switch to stacked layout below 768px.
- Navigation collapses to hamburger below 768px.
- Font sizes scale down proportionally at mobile (not arbitrary).
- Touch targets remain accessible at mobile.
```

## Content Rules

```
- Headings must be specific to the project.
- No interchangeable section headings that could belong to any business.
- Claims must be backed by proof (screenshot, metric, implementation detail, case study).
- CTA text must be specific to the action.
- Error messages must be specific and actionable.
- Empty states must provide a next action.
- Success states must confirm what happened.
```

## Anti-Patterns

```
- Fake logo marks.
- One-off CTA styles.
- Raw color classes in components.
- Layout-only fixes that create hydration risk.
- Scroll effects that reduce readability.
- Unverified responsive assumptions.
- Hidden dead features.
- Unscoped AI refactors.
- Generic AI marketing copy.
- Fake testimonials, metrics, or client logos.
- Decorative assets without concept rationale.
- Sections that could be copied into another project unchanged.
```

## QA Routes

```
| Route | Screenshot Required | Mobile | Tablet | Desktop | Interaction Test |
|---|---|---|---|---|---|
| / | Yes | Yes | Yes | Yes | CTA click |
| /portfolio | Yes | Yes | Yes | Yes | Filter/nav |
| /pricing | Yes | Yes | Yes | Yes | Form submit |
| /admin | Yes | Yes | Yes | Yes | CRUD flow |
```

## Launch Checklist

```
- [ ] Design contract finalized
- [ ] All routes screenshot-verified at mobile, tablet, desktop
- [ ] No fake brand assets
- [ ] No raw hex values outside tokens
- [ ] All interactive states working
- [ ] Reduced motion respected
- [ ] Lighthouse scores >= 90
- [ ] Accessibility audit passed
- [ ] Humanization audit passed
- [ ] Build passing
- [ ] Deployment smoke test passed
- [ ] Portfolio case study written
