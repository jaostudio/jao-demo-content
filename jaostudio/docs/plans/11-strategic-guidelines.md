# Strategic Guidelines & Advanced Systems

## Image Optimization Strategy

### Formats
```
AVIF — primary format (best compression/quality ratio)
WebP — fallback for older browsers
PNG  — only for icons/graphics requiring transparency
```

### Sizes
| Context | Widths | Breakpoints |
|---|---|---|
| Project hero | 1920, 1280, 768, 480 | All |
| Project thumbnail | 600, 400, 200 | Desktop, mobile |
| OG image | 1200×630 | Fixed |
| Favicon | 32, 64, 180 | All |

### Loading Rules
```
Priority (priority={true}): only hero images, above-the-fold content
Lazy loading (default):     everything below the fold
Placeholder:                blurred (blurDataURL) or solid color matching bg
Format:                     next/image with format detection (accept: image/avif)
```

## Perceived Performance Planning

Perception of speed matters as much as actual speed.

### Techniques

| Technique | Where |
|---|---|
| Instant page transition | AnimatePresence — no blank flash between routes |
| Skeleton screens | Project pages, content loading states |
| Progressive image reveal | Images fade in as they load (not pop in) |
| Staggered section loading | Sections reveal as user scrolls (creates feeling of speed) |
| Optimistic UI | Contact form shows success before confirmation |
| Instant navigation | `next/link` prefetching on hover |

### What to AVOID
- Fake loading bars or spinners
- Artificial delays (no "loading..." screens)
- Unnecessary JavaScript before interactive

## Lead Qualification System

The contact form should filter serious inquiries, not maximize volume.

### Form Fields

```
Name                  (required, text)
Email                 (required, email)
Business Name         (optional, text)
Project Type          (required, select)
  ├ Business Website
  ├ Landing Page
  ├ SaaS / Web App
  ├ Redesign
  └ Other

Budget Range          (required, select)
  ├ < $1,000
  ├ $1,000 – $3,000
  ├ $3,000 – $5,000
  ├ $5,000 – $10,000
  └ $10,000+

Timeline              (required, select)
  ├ 1-2 weeks
  ├ 2-4 weeks
  ├ 1-2 months
  └ Flexible

Message               (optional, textarea)
```

### Why This Works
- Budget field filters tire kickers immediately
- Project type helps you prepare for the conversation
- Timeline sets expectations upfront
- The form itself signals: "this developer works with serious clients"

### Response Protocol
1. Auto-response: confirmation + timeline expectations
2. Personal follow-up within 24 hours (aim for same-day)
3. Calendly link in auto-response for immediate booking

## Identity Differentiators

The portfolio needs recognizable visual signatures that make it uniquely yours:

### Signatures to Establish

| Element | Goal |
|---|---|
| Card style | Single border + subtle surface, never flat |
| Border treatment | `rgba(255,255,255,0.06)`, 12px radius |
| Motion timing | 0.5s ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) |
| Section flow | Asymmetric alternating (text-left/visual-right → flip) |
| Hero structure | Split screen, left text + right floating visual system |
| Section title style | Small uppercase label + large heading |
| Accent usage | Only on CTAs, active states, hover effects — never decorative |
| Mockup style | No browser chrome, subtle card shadow, consistent viewpoint |

If someone sees a screenshot of your portfolio without the URL, they should recognize it as yours.

## Visual Weight Budget

Most portfolios become visually exhausting. Enforce these limits:

```
Per viewport:
  Glowing/highlight elements:  max 1
  Simultaneous motion zones:   max 2
  Active animations:           max 3
  Accent-colored elements:     max 2
  High-contrast elements:      max 1

Per page:
  Gradient backgrounds:        max 2 (hero + optional CTA)
  Glassmorphism elements:      max 2 (navbar + optional card)
  Parallax layers:             max 3 total
```

When a section needs more visual weight, reduce it elsewhere. The page must breathe.

## Build Order (Psychological Priority)

Not technical order — **conversion priority order**.

```
Phase A — Foundation
  design tokens → typography → layout primitives → motion primitives

Phase B — First Impression
  hero section → navbar → background systems

Phase C — Proof
  single flagship project (deep case study)

Phase D — Trust
  process → tech credibility → about

Phase E — Scale
  remaining sections → services → playground → contact

Phase F — Polish
  SEO → Analytics → Performance audit → QA → Deploy
```

This order ensures the highest-impact elements are perfected first. If time runs short, you have a working hero + one case study + trust signals — which is more effective than 10 mediocre sections.

## Final Strategic Reminder

```
You are not building a website about yourself.

You are building a perception engine.

Every:
  animation · spacing choice · shadow · transition
  sentence · mockup · interaction · border radius

contributes to whether a client believes you are
worth premium pricing.

That should guide every implementation decision.
```

---

*Last updated: 2026-05-27*
