# Design Contract — Likha

## Brand Position

Likha is a process-first creative platform where artists document their work from sketch to final piece, making the creative process visible and verifiable.

## Visual Tone

Warm / Editorial / Grounded — inspired by studio spaces, natural materials, and the authenticity of hand-made work.

## Design Principles

1. Process is the product — every UI decision should foreground the artist's journey, not just the final output.
2. Warmth without noise — textures and accents (moss green, bougainvillea pink) add character without competing with content.
3. Authenticity over polish — provenance badges, version histories, and process documentation are first-class UI elements, not footnotes.

## Color Semantics

### Token Definitions

- `color-primary` (#5b8c5a, moss green): Primary CTAs, active states, brand accents.
- `color-accent` (#d4738a, bougainvillea pink): Secondary highlights, demo markers, special annotations.
- `color-reactor-green` → `color-primary`: Note — migrated from "reactor green" naming to semantic `primary`.
- `color-voltage-pink` → `color-accent`: Note — migrated from "voltage pink" naming to semantic `accent`.
- `surface-base` → `--color-bg`: Page background.
- `surface-raised` → `--color-card`: Cards and panels.
- `border-subtle` → `--color-border`: Low-contrast structural borders.
- `text-primary` → `--color-fg`: Headings and important body text.
- `text-muted` → `--color-muted-foreground`: Secondary explanatory text.
- `status-success`: Green tones for success states and confirmations.
- `status-error`: Red tones for error states and destructive actions.
- `status-warning`: Amber tones for warning states.

Raw hex values are prohibited outside token definitions in `globals.css`.

### Usage Rules

- Primary CTA uses `color-primary` (moss green). Only one per section.
- Accent CTA uses `color-accent` (bougainvillea pink). Reserved for demo markers, review indicators, provenance badges.
- Error states use `status-error`. Never use red for decoration.
- Success states use `status-success`. Never use green for CTA unless approved.

## Typography

| Element | Font | Weight | Size | Line Height |
|---|---|---|---|---|
| Heading 1 | Inter | 700 | 32px / 2rem | 1.2 |
| Heading 2 | Inter | 600 | 24px / 1.5rem | 1.3 |
| Body | Inter | 400 | 15px / 0.9375rem | 1.6 |
| Small / Caption | Inter | 400 | 13px / 0.8125rem | 1.5 |
| Mono / Code | JetBrains Mono | 400 | 13px | 1.5 |

### Typography Rules

- Maximum line length: 70 characters for body text.
- Heading hierarchy must be semantic (h1 → h2 → h3).
- No text smaller than 13px for UI labels; 15px minimum for body content.
- Link text must be distinguishable by more than color (underline or icon).

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

## Layout Rules

- Max content width: 1200px.
- Side padding at mobile: 16px.
- Side padding at tablet: 32px.
- Side padding at desktop: 64px.
- Grid columns: 12-column grid at desktop, 4-column at mobile.
- Sticky headers must not exceed 20% of viewport height.
- No horizontal overflow at any breakpoint.

## Component Rules

- Pages compose components. Components consume tokens. Tokens define visual language.
- Pages do not invent styling primitives.
- Every component has typed props.
- Every component has variant rules.
- No one-off CTA styles — use Button variants (`variant="accent"`, `variant="ghost"`, etc.).
- Card border radius, shadow, and padding are defined by tokens, not per-instance values.

## Motion Rules

- Use CSS transitions for simple state changes.
- Use IntersectionObserver for reveal-on-scroll.
- No Framer Motion unless explicitly approved.
- No layout-shifting animation.
- All motion must respect `prefers-reduced-motion`.
- Motion must clarify hierarchy or state. Decoration-only motion is discouraged.
- Transition duration: 200-300ms for micro-interactions.
- Stagger delay between elements: max 80ms to avoid sluggish feel.

## Accessibility Rules

- All interactive elements must be keyboard accessible.
- Focus indicators must have 3:1 contrast ratio against background.
- Skip-to-content link present on all pages.
- All images have alt text. Decorative images use alt="".
- Color is never the only differentiator for state or meaning.
- Touch targets minimum 44x44px.
- Form inputs have associated labels.
- Error messages are associated with inputs via aria-describedby.

## Responsive Rules

- Mobile-first breakpoints: 390px, 768px, 1440px.
- No horizontal scroll at any breakpoint.
- CTA text must not wrap at 390px.
- Tables switch to stacked layout below 768px.
- Navigation collapses to hamburger below 768px.
- Font sizes scale down proportionally at mobile (not arbitrary).
- Touch targets remain accessible at mobile.

## Content Rules

- Headings must be specific to the project.
- No interchangeable section headings that could belong to any business.
- Claims must be backed by proof (screenshot, metric, implementation detail, case study).
- CTA text must be specific to the action.
- Error messages must be specific and actionable.
- Empty states must provide a next action.
- Success states must confirm what happened.

## Anti-Patterns

- Fake logo marks.
- One-off CTA styles.
- Raw color classes in components.
- Layout-only fixes that create hydration risk (`suppressHydrationWarning`).
- Scroll effects that reduce readability.
- Unverified responsive assumptions.
- Hidden dead features ("Coming soon" markers).
- Unscoped AI refactors.
- Generic AI marketing copy.
- Fake testimonials, metrics, or client logos.
- Decorative assets without concept rationale.
- Sections that could be copied into another project unchanged.

## QA Routes

| Route | Screenshot Required | Mobile | Tablet | Desktop | Interaction Test |
|---|---|---|---|---|---|
| / | Yes | Yes | Yes | Yes | Theme toggle, sign-in CTA |
| /explore | Yes | Yes | Yes | Yes | Filter, card click |
| /work/[slug] | Yes | Yes | Yes | Yes | Version comparison |
| /search | Yes | Yes | Yes | Yes | Search input, tab switch |
| /studio | Yes | Yes | Yes | Yes | CRUD flow |
| /studio/new | Yes | Yes | Yes | Yes | Article form submit |
| /admin | Yes | Yes | Yes | Yes | Dashboard data load |
| /admin/review | Yes | Yes | Yes | Yes | Review actions |
| /admin/analytics | Yes | Yes | Yes | Yes | Stats display |

## Launch Checklist

- [x] Design contract finalized
- [x] All routes screenshot-verified at mobile, tablet, desktop
- [x] No fake brand assets
- [x] No raw hex values outside tokens
- [ ] All interactive states working
- [x] Reduced motion respected
- [ ] Lighthouse scores >= 90
- [ ] Accessibility audit passed
- [x] Humanization audit passed
- [x] Build passing
- [ ] Deployment smoke test passed
