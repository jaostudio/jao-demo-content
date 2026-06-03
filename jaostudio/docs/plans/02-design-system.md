# Design System

## Theme

- **Mode:** Dark-only at launch
- **Aesthetic:** Premium dark UI — minimal, cinematic, modern SaaS
- **Inspiration:** Apple, Linear, Vercel, Stripe, Framer

## Color Palette

### Backgrounds
```
--bg-primary:   #050505
--bg-secondary: #0A0A0A
--bg-surface:   #111111
```

### Text
```
--text-primary:   #FAFAFA
--text-secondary: #A1A1AA
--text-tertiary:  #52525B
```

### Accent
```
--accent:        #7C3AED
--accent-hover:  #6D28D9
--accent-subtle: rgba(124, 58, 237, 0.12)
--accent-glow:   rgba(124, 58, 237, 0.18)
```

### Borders & Surfaces
```
--border:        rgba(255, 255, 255, 0.08)
--border-hover:  rgba(255, 255, 255, 0.12)
--surface-hover: rgba(255, 255, 255, 0.03)
```

### Hero Gradient
```
--gradient-hero: radial-gradient(
  circle at 50% 0%,
  rgba(124, 58, 237, 0.15),
  transparent 60%
)
```

## Color Rules

1. 80% dark neutrals, 15% typography, 5% accent
2. Do not flood UI with accent — destroys premium perception
3. Use `#FAFAFA` not pure white (pure white fatigues on dark)
4. Small accent glow = premium. Too much = crypto scam aesthetic.

## Typography

| Usage | Font | Weight |
|---|---|---|
| Headlines | Geist (primary) | Semibold 600 |
| Body | Inter (fallback) | Regular 400 |
| Mono | JetBrains Mono | For code |

### Type Scale
```
Hero:        text-7xl md:text-8xl, semibold, tracking-tight, leading-[0.9]
Section Hd:  text-4xl md:text-5xl, semibold, tracking-tight
Subheading:  text-xl md:text-2xl, medium
Body:        text-base md:text-lg, text-secondary, leading-relaxed
Small:       text-sm, text-tertiary
```

## Spacing

```
Section padding: py-24 md:py-32 lg:py-40
Container max:   1280px (max-w-7xl)
Content width:   768px (max-w-3xl)
Gaps:            gap-8 (cards), gap-16 (sections), gap-24 (page blocks)
```

## Border Radius
```
--radius-sm:    8px
--radius-md:    12px
--radius-lg:    16px
--radius-xl:    24px
--radius-2xl:   32px
--radius-full:  9999px
```

## Shadows

```
--shadow-subtle:    0 0 0 1px rgba(255,255,255,0.05)
--shadow-card:      0 0 0 1px rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)
--shadow-elevated:  0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.5)
```

## Motion Timing

```
--duration-fast:   150ms
--duration-normal: 300ms
--duration-slow:   500ms
--duration-xl:     800ms

--ease-out:        cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out:     cubic-bezier(0.65, 0, 0.35, 1)
--ease-cinematic:  cubic-bezier(0.65, 0, 0.35, 1)
```

All these must be defined in `src/styles/tokens.css` as CSS custom properties, then referenced in `globals.css` and components.

---

*Last updated: 2026-05-27*
