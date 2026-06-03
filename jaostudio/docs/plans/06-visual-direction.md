# Visual Direction Lock

## Purpose

Prevent aesthetic drift during implementation. Every component decision validated against these constraints.

## Target Aesthetic

```
Premium dark UI · Minimal · Cinematic · Modern SaaS
```

## Allowed Inspirations

| Reference | Why |
|---|---|
| Linear | Typography rhythm, spacing, card design, restrained accent |
| Vercel | Dark theme execution, navigation clarity, section pacing |
| Framer | Motion polish, cursor interactions, page transitions |
| Raycast | Glassmorphism restraint, border handling, surface hierarchy |
| Stripe Press | Typographic sophistication, content density balance |
| Apple (Pro pages) | Hero scale, cinematic pacing, product presentation |

Study these for **feel** — spacing rhythm, typography proportion, motion restraint. Do not copy.

## Forbidden Patterns

| Pattern | Why |
|---|---|
| Giant radial gradients covering entire sections | Cheapens dark theme, looks like 2021 templates |
| Neon cyberpunk aesthetic | Wrong positioning — gamer, not premium |
| Dashboard spam | Admin panel layouts, not portfolio |
| Excessive glassmorphism | Blur overload, reduced readability, dated |
| Floating particles / confetti | Distracting, poor performance, amateur |
| Boxed sections with heavy borders | "Card template" feel, no visual flow |
| Centered-everything layouts | Static, predictable, no visual tension |
| Huge tech icon walls | Developer-focused, not business-focused |
| Animated gradient text | Unreadable, trendy not premium |
| Scroll-jacking | Breaks expectations, hurts accessibility |

## Visual Noise Budget

```
Simultaneous motion zones:  max 2 per viewport
Glowing elements:           max 1 per viewport
Animated backgrounds:       max 1 (hero glow only)
Active hover effects:       max 3 per page
```

## Shadow Softness

| Level | Shadow | Use |
|---|---|---|
| 0 | None | Flat surfaces, backgrounds |
| 1 | `0 0 0 1px rgba(255,255,255,0.05)` | Subtle separation |
| 2 | `0 0 0 1px rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.4)` | Cards |
| 3 | `0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px rgba(0,0,0,0.5)` | Elevated cards, modals |

No colored shadows. No huge blur-radius shadows.

## Border Visibility

| Context | Border |
|---|---|
| Default surfaces | `rgba(255,255,255,0.06)` |
| Hovered surfaces | `rgba(255,255,255,0.1)` |
| Active/selected | `rgba(124,58,237,0.3)` |
| Cards | `rgba(255,255,255,0.08)` |

Borders should be felt, not seen. If a border draws attention, it's too visible.

## Surface Opacity

| Surface | BG |
|---|---|
| Page background | `#050505` |
| Section alternation | `#0A0A0A` |
| Cards | `#111111` |
| Elevated surfaces | `#161616` |
| Glass (navbar) | `rgba(5,5,5,0.8)` with backdrop-blur |

## Motion Density Rules

- Section entrance: 1 animation per section view (the section or its children)
- Hover effects: only on interactive elements (buttons, links, cards)
- Scroll effects: 1 parallax layer per section max
- Page transitions: subtle opacity + y-shift only

## Identity Differentiators

Define these visual signatures and apply consistently:

```
Signature card style:         Single border + subtle surface gradient
Signature border:             rgba(255,255,255,0.06), 12px radius
Signature motion timing:      0.5s ease-out (0.16, 1, 0.3, 1)
Signature section flow:       Asymmetric alternating layout
Signature hero structure:     Split left/right with floating visual system
```

## Responsive Adaptation

| Breakpoint | Changes |
|---|---|
| Desktop 1280px+ | Full asymmetric, horizontal scroll timelines |
| Tablet 768-1279px | Single column, spacing -25% |
| Mobile <768px | Single column, no parallax, simplified mockups, full-width |

---

*Last updated: 2026-05-27*
