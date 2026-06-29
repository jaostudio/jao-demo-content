# Accessibility Gate

## Purpose

Ensure the project meets WCAG 2.1 AA standards.

## Automated Checks

```bash
# Lighthouse a11y audit (run in CI or locally)
# axe-core via Playwright
npm run test:a11y
```

## Manual Checklist

### Keyboard Navigation

- [ ] All interactive elements reachable via Tab
- [ ] Tab order follows visual order
- [ ] Focus indicators visible (3:1 contrast ratio)
- [ ] No keyboard traps
- [ ] Escape closes modals, menus, dialogs
- [ ] Enter/Space activates buttons and links
- [ ] Arrow keys work for tabs, lists, menus

### Screen Reader

- [ ] Skip-to-content link present
- [ ] Page has a unique, descriptive `<title>`
- [ ] Landmarks used correctly (`<nav>`, `<main>`, `<aside>`, etc.)
- [ ] All images have alt text (decorative: `alt=""`)
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages associated via `aria-describedby`
- [ ] Status changes announced (aria-live regions)
- [ ] Modal has `role="dialog"` and `aria-modal="true"`
- [ ] Focus moves to modal on open, returns on close

### Color and Contrast

- [ ] Body text contrast >= 4.5:1
- [ ] Large text contrast >= 3:1
- [ ] Focus indicator contrast >= 3:1
- [ ] Color not the only differentiator (add icons, underlines, patterns)
- [ ] Links distinguishable from body text by more than color

### Forms

- [ ] All inputs have labels
- [ ] Required fields indicated (and `aria-required="true"`)
- [ ] Validation errors shown and associated with inputs
- [ ] Error summary provided at top of form (optional but recommended)
- [ ] Auto-fill attributes set correctly

### Motion

- [ ] `prefers-reduced-motion: reduce` respected
- [ ] No auto-playing animations
- [ ] No flashing content (> 3 flashes per second)
- [ ] No parallax or scroll-jacking effects

### Content

- [ ] Headings are semantic (h1 → h2 → h3, not skipped)
- [ ] Link text is descriptive (not "click here")
- [ ] No empty buttons or links
- [ ] Descriptive aria-labels for icon-only buttons

## Pass Criteria

```
- Lighthouse a11y score >= 90
- axe-core: 0 violations
- All manual checklist items pass
- Keyboard navigation through all routes is functional
- Screen reader can navigate key flows
```

## Fail Actions

| Issue | Action |
|---|---|
| Missing alt text | Add to all images |
| Focus indicator missing | Add focus-visible styles |
| Contrast failure | Adjust colors within token system |
| No skip link | Add skip-to-content link |
| Keyboard trap | Fix focus management |
| Missing label | Add label to all inputs |
