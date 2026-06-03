# Project Presentation Pipeline

## Standardized Case Study Structure

Every project detail page must include these sections in order:

```
┌─────────────────────────────────┐
│ 1. Hero Banner                  │
│    Full-screen mockup preview   │
│    Desktop + mobile device      │
│    Cinematic presentation       │
├─────────────────────────────────┤
│ 2. Overview                     │
│    Client Problem               │
│    Business Goals               │
│    Target Users                 │
│    Challenges                   │
├─────────────────────────────────┤
│ 3. Solution                     │
│    Architecture Decisions       │
│    UX Decisions                 │
│    Performance Work             │
│    Conversion Strategy          │
├─────────────────────────────────┤
│ 4. Feature Breakdown            │
│    Key features with screenshots│
│    Why each matters             │
├─────────────────────────────────┤
│ 5. Tech Stack                   │
│    Each technology listed       │
│    WITH why it was chosen       │
│    (Not just icon spam)         │
├─────────────────────────────────┤
│ 6. Metrics                      │
│    Lighthouse score             │
│    Load time                    │
│    SEO status                   │
│    Responsive verification      │
├─────────────────────────────────┤
│ 7. Live Preview                 │
│    Embedded scrolling demo      │
│    Device frame (desktop/mobile)│
│    "Open Live Site" link        │
├─────────────────────────────────┤
│ 8. CTA                          │
│    "Start a similar project"    │
│    Link to contact              │
└─────────────────────────────────┘
```

## Business Framing

Every project description must answer:

1. **What business problem does this solve?**
   - Not "it's a website" but "it helps customers find plans and sign up"
2. **What goals was it designed to achieve?**
   - Conversion, trust, clarity, speed
3. **Who is it for?**
   - End users, business owners, customers
4. **What challenges did it address?**
   - Information density, mobile experience, SEO

## Tech Rationale Format

Bad:
```
Next.js, Tailwind, Framer Motion
```

Good:
```
Next.js — Static generation for speed, SSR for SEO
Tailwind — Rapid responsive iteration
Framer Motion — Premium scroll and hover interactions
```

Each technology needs a WHY that relates to business outcomes.

## Screenshot Standards

```
All images must be consistent across every project:

Aspect ratio (desktop):  16:9 (1920×1080)
Aspect ratio (mobile):   390×844 (iPhone 14 Pro size)
Browser chrome:          None — full viewport only
Shadow treatment:        Same shadow-elevated style
Lighting:                Same brightness/contrast grading
File naming:             {project}-{device}-{variant}.webp
Format:                  AVIF preferred, WebP fallback
```

## Mockup Presentation Standards

| Element | Standard |
|---|---|
| Desktop frame | No browser chrome, just the page in a subtle card shadow |
| Mobile frame | Dark device bezel + rounded corners, page inside |
| Multiple devices | Desktop + mobile side by side, different sizes |
| Hover state | Subtle lift (shadow elevation) on hover |
| Loading | Skeleton with same aspect ratio |

## Metrics Strategy

Even internal/fictional projects need quantified framing:

```
95+ Lighthouse score
<1.5s page load time
Responsive across all devices
SEO-optimized semantic structure
Accessibility-aware markup
Component-driven architecture
```

Metrics create **credibility anchors**. They make the project feel real and production-grade.

---

*Last updated: 2026-05-27*
