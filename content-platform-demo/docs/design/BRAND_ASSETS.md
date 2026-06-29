# Brand Assets

## Logo

| Variant | File | Usage |
|---|---|---|
| Primary | `[path/to/logo-primary.svg]` | Light backgrounds |
| Inverse | `[path/to/logo-inverse.svg]` | Dark backgrounds |
| Icon only | `[path/to/logo-icon.svg]` | Favicon, mobile nav |
| Mark | `[path/to/logo-mark.svg]` | Social preview |

### Logo Rules

- Always use official logo files. No text-based recreations, emoji stand-ins, or CSS approximations.
- Minimum clear space: height of the logo on all sides.
- Do not rotate, stretch, recolor, or add effects to the logo.
- Do not place the logo on backgrounds with insufficient contrast.

## Icons

| Icon | File | Usage |
|---|---|---|
| [icon name] | `[path]` | [usage context] |
| [icon name] | `[path]` | [usage context] |

### Icon Rules

- Use a consistent icon library (Lucide, Phosphor, or custom).
- Do not mix icon families.
- Icons must have a label or aria-label for accessibility.

## Images

| Asset | File | Usage |
|---|---|---|
| Hero image | `[path]` | Homepage hero |
| [Asset] | `[path]` | [Usage] |

### Image Rules

- All images have alt text. Decorative images use `alt=""`.
- Images must be optimized for web (WebP, lazy loading, appropriate dimensions).
- No placeholder images in production.
- Screenshots must be real or clearly marked as demo.

## Typography Assets

| Asset | Source | Usage |
|---|---|---|
| [Font name] | Google Fonts / Self-hosted | Headings |
| [Font name] | Google Fonts / Self-hosted | Body text |

### Font Rules

- Font files must be loaded with `font-display: swap`.
- Only [number] font families allowed. No additional fonts without design review.
- Variable fonts preferred where available.

## Asset Directory

```
src/
  assets/
    brand/
      logo-primary.svg
      logo-inverse.svg
      logo-icon.svg
      logo-mark.svg
    icons/
      [custom icons if any]
    images/
      hero.webp
      screenshot-dashboard.webp
      screenshot-quote-flow.webp
```
