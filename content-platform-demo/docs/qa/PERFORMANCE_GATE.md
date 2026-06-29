# Performance Gate

## Purpose

Ensure the project meets performance budgets for load time, bundle size, and Core Web Vitals.

## Lighthouse Budgets

| Metric | Target |
|---|---|
| Performance score | >= 90 |
| First Contentful Paint (FCP) | <= 1.5s |
| Largest Contentful Paint (LCP) | <= 2.5s |
| Total Blocking Time (TBT) | <= 200ms |
| Cumulative Layout Shift (CLS) | <= 0.1 |
| Speed Index | <= 3.0s |

## Bundle Size Budgets

| Asset | Limit |
|---|---|
| Initial JS (gzipped) | <= 100KB |
| Initial CSS (gzipped) | <= 20KB |
| Total JS (gzipped) | <= 300KB |
| Font files | <= 50KB total |
| Largest image | <= 200KB |

## Optimization Checks

### Images

- [ ] All images use modern format (WebP / AVIF)
- [ ] Images have `loading="lazy"` (except above-fold hero)
- [ ] Images have explicit `width` and `height` to prevent layout shift
- [ ] Hero image preloaded with `fetchpriority="high"`
- [ ] No oversized images (dimensions match display size)

### Fonts

- [ ] Fonts loaded with `font-display: swap`
- [ ] Subset fonts to needed characters
- [ ] Preload critical fonts
- [ ] Variable fonts preferred to reduce file count

### JavaScript

- [ ] No render-blocking third-party scripts
- [ ] Code splitting used for route-specific code
- [ ] No large dependencies without tree-shaking verification
- [ ] Dynamic imports for heavy components (charts, editors, maps)

### CSS

- [ ] Tailwind purged (no unused styles)
- [ ] Critical CSS inlined or loaded early
- [ ] No `@import` in CSS files

### Caching

- [ ] Static assets cached with immutable cache headers
- [ ] API responses cached where appropriate
- [ ] Service worker considered for offline support (if needed)

## Pass Criteria

```
- Lighthouse performance >= 90 on all routes
- All bundle size budgets met
- Core Web Vitals pass
- No render-blocking resources above fold
```

## Fail Actions

| Issue | Action |
|---|---|
| Large bundle | Code-split, tree-shake, or lazy-load |
| Slow LCP | Optimize hero image, reduce above-fold JS |
| Layout shift | Set explicit dimensions on all media |
| Render-blocking script | Defer or async |
| Unoptimized image | Convert to WebP, resize |
