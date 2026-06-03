# Content Strategy

## Architecture

- **MDX files** for case studies and long-form pages
- **Contentlayer** for typed frontmatter, static generation, metadata pipelines
- **Hardcoded translations** (`translations.ts`) for UI chrome (navbar, buttons, labels)
- **Bilingual:** English for project content, EN/TL toggle for UI elements

## Project Content Schema

Each MDX file at `content/projects/[slug].mdx`:

```mdx
---
slug: "isp-platform"
title: "ISP Platform Concept"
tagline: "A modern broadband provider website focused on trust, conversion, and service clarity."
category: "Business Website"
published: true
date: 2025-01-01
featured: true

stack:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
  - "Framer Motion"
  - "Vercel"

metrics:
  lighthouse: 95
  performance: "<1.5s load time"
  seo: "Optimized"
  responsive: true

features:
  - "Responsive pricing system"
  - "Modern service UI"
  - "CTA optimization"
  - "Support center structure"
  - "SEO-ready architecture"

challenges:
  - "Communicating complex service tiers intuitively"
  - "Balancing information density with clean aesthetics"

gallery:
  - "/projects/desktop/isp-hero.png"
  - "/projects/mobile/isp-mobile.png"

liveUrl: "https://example.vercel.app"
githubUrl: "https://github.com/user/isp-platform"
---

## Business Context

### Problem | Goals | Target Users | Challenges

## Solution

### Architecture Decisions | UX Decisions | Performance Work

## Features

### Key features with screenshots

## Tech Stack

### Each technology with WHY it was chosen

## Metrics

### Lighthouse, load time, responsiveness, SEO
```

### TypeScript interface
```ts
interface ProjectMetadata {
  slug, title, tagline, category, published, date, featured: boolean
  stack: string[]
  metrics: { lighthouse: number; performance: string; seo: string; responsive: boolean }
  features: string[]
  challenges: string[]
  gallery: string[]
  liveUrl: string
  githubUrl?: string
}
```

## Copywriting

### Microcopy Table
| Instead of | Use |
|---|---|
| Contact | Discuss Your Project |
| Projects | Selected Work |
| Skills | What I Build |
| About | Background |
| Contact Me | Start a Project |
| Learn More | Explore Case Study |

### Tone
- Professional but not corporate
- Confident but not arrogant
- Technical but accessible
- Outcome-focused, not feature-focused

### Hero Pattern
```
[Credibility badge]
[Large outcome-driven headline]
[Short paragraph — business value, not tech list]
[CTA row: Primary / Secondary / Tertiary]
```

### About Pattern
```
I specialize in building modern websites
that help businesses establish stronger
credibility online.

My focus extends beyond visuals —
I prioritize performance, responsiveness,
maintainability, and conversion-focused UX.
```

## Asset Pipeline

```
public/projects/
  desktop/    1920×1080  — full-page screenshots
  mobile/     390×844    — device frame screenshots
  thumbnails/ 600×400    — card thumbnails
  og/         1200×630   — OG images
```

All imagery consistent aspect ratio, browser chrome, shadow treatment, lighting.

---

*Last updated: 2026-05-27*
