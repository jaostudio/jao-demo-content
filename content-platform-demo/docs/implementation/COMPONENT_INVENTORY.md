# Component Inventory

## UI Primitives

| Component | Variants | States | Responsive Notes |
|---|---|---|---|
| Button | primary, secondary, ghost, danger, link | default, hover, focus, disabled, loading | Full-width at mobile if needed |
| Card | default, flat, interactive | default, hover (interactive), focus (interactive) | Full-width at mobile |
| Badge | default, success, warning, error | — | Consistent sizing |
| Input | default, error, disabled | default, focus, error, disabled, filled | Full-width at mobile |
| Textarea | default, error, disabled | default, focus, error, disabled, filled | Full-width at mobile |
| Select | default, error, disabled | default, focus, error, disabled | Full-width at mobile |
| Modal | default | open, closing | Full-screen sheet at mobile |
| Tabs | underline, pill | default, active, hover, focus | Scrollable at mobile |
| EmptyState | — | — | Centered, action optional |
| LoadingState | skeleton, spinner, progress | — | Match content layout |
| ErrorState | — | — | Retry action |
| PageHeader | — | — | Responsive padding |
| Section | — | — | Consistent spacing |

## Layout Components

| Component | Props | Notes |
|---|---|---|
| SiteHeader | — | Sticky, responsive nav, hamburger at mobile |
| SiteFooter | — | Multi-column at desktop, stacked at mobile |
| AppShell | sidebar, header, content | Sidebar collapses at mobile |
| AuthShell | — | Centered form, brand header |

## Marketing Components

| Component | Variants | Notes |
|---|---|---|
| Hero | left-align, center, split | Image position varies by variant |
| FeatureGrid | 3-col, 2-col, 4-col | Responsive column count |
| ProofSection | metrics, testimonials, logos | Varied layout per variant |
| TestimonialCard | — | Quote, author, optional image |
| PortfolioCard | — | Image, title, tags, hover state |
| CTASection | — | Primary CTA, optional secondary |

## Form Components

| Component | Fields | Validation |
|---|---|---|
| ContactForm | name, email, message | All required, email format |
| QuoteForm | service, details, contact | Conditional fields |

## Build Order

```
1. UI primitives (Button, Card, Input, etc.)
2. Layout components (Header, Footer, Shell)
3. Feature components (Hero, FeatureGrid, etc.)
4. Form components
5. Pages (compose from components)
```

## Component Checklist

For each component:

- [ ] Typed props
- [ ] Variant rules
- [ ] Token-based styling
- [ ] Accessible semantics
- [ ] Keyboard behavior
- [ ] Focus states
- [ ] Responsive behavior
- [ ] Loading state (if relevant)
- [ ] Error state (if relevant)
- [ ] Empty state (if relevant)
- [ ] No raw design values
