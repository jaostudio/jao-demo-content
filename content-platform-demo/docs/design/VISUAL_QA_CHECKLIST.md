# Visual QA Checklist

## Per Route

### Layout

- [ ] No horizontal overflow at any breakpoint
- [ ] Consistent side padding at each breakpoint
- [ ] Vertical rhythm is consistent
- [ ] Sticky elements do not exceed 20% of viewport height
- [ ] Grid alignment is correct at all breakpoints

### Typography

- [ ] Font sizes scale correctly at mobile
- [ ] Line length does not exceed 70 characters for body text
- [ ] Heading hierarchy is visually clear
- [ ] No text clipping or truncation without ellipsis
- [ ] Link text is distinguishable (underline, icon, or weight)

### Color

- [ ] Brand colors used consistently
- [ ] No raw hex values in component code
- [ ] Contrast ratio >= 4.5:1 for body text
- [ ] Contrast ratio >= 3:1 for large text
- [ ] Color is not the only differentiator for state

### Spacing

- [ ] Padding within components matches spacing tokens
- [ ] Gap between related elements is smaller than between unrelated elements
- [ ] Section spacing is consistent across routes
- [ ] Mobile padding is consistent (typically 16px sides)

### Interactive Elements

- [ ] Buttons have hover state
- [ ] Buttons have focus-visible state
- [ ] Buttons have disabled state (if applicable)
- [ ] Links have hover state
- [ ] Links have focus-visible state
- [ ] Inputs have focus state
- [ ] Touch targets are minimum 44x44px
- [ ] Loading state visible for async actions

### Images and Assets

- [ ] Official logo used (no text recreations)
- [ ] No broken images
- [ ] Images have alt text
- [ ] Images are optimized (WebP, lazy loading)
- [ ] No placeholder images in production
- [ ] Screenshots are real or clearly marked as demo

### Mobile Specific

- [ ] No CTA text wrapping
- [ ] Navigation collapses appropriately
- [ ] Font sizes are readable without zoom
- [ ] Touch targets do not overlap
- [ ] No horizontal scroll

### Dark Mode (if supported)

- [ ] All colors have dark mode equivalents
- [ ] Contrast ratios pass in dark mode
- [ ] No inverted images
- [ ] Consistent dark mode across all routes

### Reduced Motion

- [ ] Site is fully usable with `prefers-reduced-motion: reduce`
- [ ] No lingering animations when reduced motion is active
- [ ] All content appears immediately when motion is reduced

### Cross-Route Consistency

- [ ] Headers consistent across routes
- [ ] Footers consistent across routes
- [ ] Button styles consistent
- [ ] Card styles consistent
- [ ] Form styles consistent
- [ ] Empty states follow the same pattern

### Final Checks

- [ ] No console errors on any route
- [ ] No network errors on any route
- [ ] Favicon loads
- [ ] Meta tags are correct
- [ ] Robots.txt exists (if public)
