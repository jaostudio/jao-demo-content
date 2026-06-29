# Component Rules

## Core Rule

```
Pages compose components.
Components consume tokens.
Tokens define visual language.
Pages do not invent styling primitives.
```

## Component Inventory Structure

```
src/
  components/
    ui/           — Button, Card, Badge, Input, Textarea, Select, Modal, Tabs,
                    EmptyState, LoadingState, ErrorState, PageHeader, Section
    layout/       — SiteHeader, SiteFooter, AppShell, AuthShell
    marketing/    — Hero, FeatureGrid, ProofSection, TestimonialCard,
                    PortfolioCard, CTASection
    forms/         — QuoteForm, ContactForm
```

## Component Acceptance Standard

A component is done when it has:

```
- [ ] Typed props (TypeScript)
- [ ] Variant rules
- [ ] Token-based styling (no raw values)
- [ ] Accessible semantics
- [ ] Keyboard behavior
- [ ] Focus states
- [ ] Responsive behavior
- [ ] Loading state (where relevant)
- [ ] Error state (where relevant)
- [ ] Empty state (where relevant)
- [ ] No raw design values
```

## Example: Button Component

### Variants

```
- primary
- secondary
- ghost
- danger
- link
```

### Sizes

```
- sm
- md
- lg
```

### States

```
- default
- hover
- focus-visible
- disabled
- loading
```

### Rules

```
- Primary button reserved for primary action.
- Only one primary CTA per section.
- Loading button must prevent duplicate submission.
- Danger variant only for destructive actions.
- Link variant must have visible underline or icon distinction.
```

## Example: Card Component

### Variants

```
- default (elevated)
- flat (no shadow)
- interactive (hoverable, clickable)
```

### Composition Rules

```
- Card header, body, footer slots.
- Consistent padding from spacing tokens.
- Border radius from token.
- Shadow from token.
- Interactive variant has hover/focus state.
```

## Example: Input Component

### Variants

```
- default
- error
- disabled
```

### States

```
- default
- focus
- error
- disabled
- filled
- placeholder
```

### Composition

```
- Label (required)
- Input element
- Error message (conditionally shown)
- Helper text (optional)
- Character count (optional)
```

## Example: Modal Component

### Behavior

```
- Traps focus within modal when open.
- Closes on Escape key.
- Closes on overlay click (configurable).
- Body scroll lock when open.
- Returns focus to trigger element on close.
- `aria-modal="true"` and `role="dialog"`.
```

## Tabs Component

### Behavior

```
- Keyboard navigation: arrow keys, Home, End.
- Active tab indicator uses token-based styling.
- Tab panel content is lazy-loaded or rendered based on state.
- `role="tablist"`, `role="tab"`, `role="tabpanel"`.
```

## EmptyState Component

### Props

```
- icon (optional)
- title
- description
- action (optional — button or link)
```

### Usage

```
- When a list, table, or dashboard section has no data.
- Provides context-specific guidance.
- Action button links to or triggers the next logical step.
```

## LoadingState Component

### Variants

```
- skeleton (matching component shape)
- spinner (for actions, not full page)
- progress (for determinate loading)
```

### Rules

```
- Skeleton should match the layout of the content it replaces.
- Spinner for button loading states.
- Progress bar for multi-step processes.
```

## ErrorState Component

### Props

```
- title
- description
- retry action (optional)
- back action (optional)
```

### Rules

```
- Error messages must be specific about what went wrong.
- Retry action only when retry is safe (idempotent).
- Do not expose stack traces or internal error details.
```
