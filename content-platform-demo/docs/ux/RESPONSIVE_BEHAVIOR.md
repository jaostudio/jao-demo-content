# Responsive Behavior Template

## Breakpoints

| Name | Width | Target |
|---|---|---|
| Mobile | 390px | Primary mobile target |
| Tablet | 768px | Tablet portrait |
| Desktop | 1440px | Primary desktop target |
| Large Desktop | 1920px | Optional — for data-heavy UIs |

## Layout Behavior

### Navigation

| Breakpoint | Behavior |
|---|---|
| Mobile | Hamburger menu, full-screen overlay or sheet |
| Tablet | Hamburger or collapsed nav (depending on links count) |
| Desktop | Horizontal nav with all links visible |

### Grid

| Breakpoint | Columns |
|---|---|
| Mobile | 4-column grid |
| Tablet | 8-column grid |
| Desktop | 12-column grid |

### Side Padding

| Breakpoint | Padding |
|---|---|
| Mobile | 16px |
| Tablet | 32px |
| Desktop | 64px |

## Per-Component Responsive Rules

### Route: `[route]`

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero | Stack layout, full-width image | Side-by-side | Side-by-side with larger copy |
| Feature grid | Single column | 2 columns | 3 columns |
| Cards | Full width | 2 per row | 3 per row |
| Tables | Horizontal scroll or stacked rows | Horizontal scroll | Full table |
| Modals | Full-screen sheet | Centered modal | Centered modal |
| Forms | Single column | Single or 2 columns | Multi-column where appropriate |
| CTAs | Full-width button | Auto-width | Auto-width |

## Interaction Changes

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hover states | No hover (use tap) | Hover + touch | Hover |
| Tooltips | Tap to toggle | Hover + tap | Hover |
| Dropdowns | Full-screen select | Select or dropdown | Dropdown |
| Drag and drop | Not supported | Optional | Supported |

## Typography Scaling

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| H1 | 1.75rem | 2rem | 2.5rem |
| H2 | 1.375rem | 1.5rem | 1.75rem |
| Body | 0.9375rem | 1rem | 1rem |
| Small | 0.8125rem | 0.875rem | 0.875rem |

## Responsive Checklist

### Per Route

- [ ] No horizontal overflow at any breakpoint
- [ ] CTA text does not wrap at 390px
- [ ] Navigation is usable at all breakpoints
- [ ] Touch targets minimum 44x44px at mobile
- [ ] Forms are fully functional at mobile
- [ ] All interactive elements are reachable at mobile
- [ ] Tables are readable (stacked or scroll) at mobile
- [ ] Images are appropriately sized per breakpoint
- [ ] Modals are dismissable at mobile
- [ ] Content is not hidden without accessible alternative
- [ ] Font sizes are readable without zoom at mobile
- [ ] No content loss at any breakpoint
