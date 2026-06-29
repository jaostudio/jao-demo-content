# Design QA Gate

## Purpose

Verify that the implementation matches the design contract and works across all breakpoints without visual defects.

## Prerequisites

- Design contract finalized at `docs/design/DESIGN_CONTRACT.md`
- All routes deployed to a preview environment or running locally

## Viewport Checks

Every route tested at:

```
- Mobile:  390px
- Tablet:  768px
- Desktop: 1440px
```

## Required Checks

### Layout

- [ ] No horizontal overflow at any breakpoint
- [ ] Consistent side padding at each breakpoint
- [ ] Grid alignment correct
- [ ] Sticky elements do not exceed 20% of viewport height
- [ ] Sections have consistent spacing

### Typography

- [ ] Font sizes scale correctly at mobile
- [ ] Line length <= 70 characters for body text
- [ ] Heading hierarchy is clear
- [ ] No text clipping

### Color and Contrast

- [ ] No raw hex values in component code (checked via grep)
- [ ] Contrast ratio >= 4.5:1 for body text
- [ ] Contrast ratio >= 3:1 for large text
- [ ] Color is not the only differentiator for state

### Components

- [ ] All button variants render correctly
- [ ] Card variants consistent
- [ ] Form inputs styled per contract
- [ ] Modals render and dismiss correctly
- [ ] Tabs navigation works
- [ ] Loading states present
- [ ] Empty states present
- [ ] Error states present

### Interactive States

- [ ] Button hover
- [ ] Button focus-visible
- [ ] Button disabled
- [ ] Button loading (prevents double submit)
- [ ] Link hover
- [ ] Link focus-visible
- [ ] Input focus
- [ ] Touch targets >= 44x44px

### Assets

- [ ] Official logo used (not text or emoji)
- [ ] No broken images
- [ ] Images have alt text
- [ ] No placeholder images

### Cross-Route Consistency

- [ ] Header consistent across routes
- [ ] Footer consistent across routes
- [ ] Button styles consistent
- [ ] Card styles consistent
- [ ] Form styles consistent

## Screenshots

Capture screenshots of each route at each breakpoint:

```
artifacts/screenshots/
  <route>/
    mobile.png
    tablet.png
    desktop.png
```

## Pass Criteria

- All P0 checks pass
- All P1 checks pass (or documented exceptions approved)
- Screenshots captured for every route at every breakpoint
- No fake brand assets

## Fail Actions

| Issue | Action |
|---|---|
| Horizontal overflow | Fix layout, retest at all breakpoints |
| Broken image | Replace or remove |
| Fake logo | Replace with official asset |
| Missing state | Implement before next review |
| CTA wrapping | Fix responsive behavior |
| Contrast failure | Adjust colors within token system |
