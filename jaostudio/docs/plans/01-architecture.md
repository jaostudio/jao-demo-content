# Architecture Plan

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (stable) | SSG/SSR, App Router, image optimization, OG generation |
| Language | TypeScript | Type safety, better DX, perceived quality |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, design tokens |
| Motion | Framer Motion + Lenis | Premium scroll + component animations |
| Content | MDX + Contentlayer | Typed frontmatter, static generation, metadata pipelines |
| UI Primitives | Radix + shadcn/ui (customized) | Accessible, composable, production-tested |
| Forms | React Hook Form + Zod + Resend | Validation, type safety, email delivery |
| Analytics | PostHog or Plausible | Conversion intelligence, privacy-respecting |
| Theme | next-themes | Dark-only at launch |
| Fonts | Geist (primary) + Inter (fallback) | Premium, modern, fast-loading |

## Directory Structure

```
/
├── content/
│   ├── projects/
│   │   ├── isp-platform.mdx
│   │   ├── landing-page.mdx
│   │   └── web-application.mdx
│   └── pages/
│       ├── about.mdx
│       └── services.mdx
│
├── public/
│   ├── projects/
│   │   ├── desktop/
│   │   ├── mobile/
│   │   ├── thumbnails/
│   │   └── og/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   │
│   │   ├── (marketing)/
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── playground/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   └── cv/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── lenis-provider.tsx
│   │   │   ├── motion-provider.tsx
│   │   │   └── cursor.tsx
│   │   │
│   │   ├── sections/
│   │   │   ├── hero.tsx
│   │   │   ├── social-proof.tsx
│   │   │   ├── featured-projects.tsx
│   │   │   ├── interactive-showcase.tsx
│   │   │   ├── services-section.tsx
│   │   │   ├── process.tsx
│   │   │   ├── tech-credibility.tsx
│   │   │   ├── results.tsx
│   │   │   ├── about-section.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── cta-section.tsx
│   │   │   └── contact-section.tsx
│   │   │
│   │   ├── typography/
│   │   │   ├── heading.tsx
│   │   │   ├── text.tsx
│   │   │   ├── badge.tsx
│   │   │   └── label.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── section.tsx
│   │   │   ├── container.tsx
│   │   │   ├── grid.tsx
│   │   │   ├── separator.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── motion/
│   │   │   ├── fade-in.tsx
│   │   │   ├── stagger.tsx
│   │   │   ├── slide-in.tsx
│   │   │   ├── scale-in.tsx
│   │   │   ├── parallax.tsx
│   │   │   └── magnetic.tsx
│   │   │
│   │   ├── project/
│   │   │   ├── hero-banner.tsx
│   │   │   ├── mockup-frame.tsx
│   │   │   ├── device-mockup.tsx
│   │   │   ├── metrics-bar.tsx
│   │   │   ├── tech-stack.tsx
│   │   │   ├── feature-list.tsx
│   │   │   └── gallery.tsx
│   │   │
│   │   ├── playground/
│   │   │   ├── animated-card.tsx
│   │   │   ├── tilt-card.tsx
│   │   │   ├── glass-card.tsx
│   │   │   ├── pricing-card.tsx
│   │   │   └── scroll-demo.tsx
│   │   │
│   │   └── forms/
│   │       ├── contact-form.tsx
│   │       ├── form-field.tsx
│   │       └── submit-button.tsx
│   │
│   ├── lib/
│   │   ├── motion/
│   │   │   ├── transitions.ts
│   │   │   ├── variants.ts
│   │   │   ├── durations.ts
│   │   │   └── easings.ts
│   │   │
│   │   ├── seo/
│   │   │   ├── metadata.ts
│   │   │   ├── json-ld.ts
│   │   │   └── schema.ts
│   │   │
│   │   ├── content/
│   │   │   ├── projects.ts
│   │   │   └── pages.ts
│   │   │
│   │   ├── utils.ts
│   │   ├── cn.ts
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   └── tokens.css
│   │
│   └── types/
│       └── index.ts
│
├── contentlayer.config.ts
├── next.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── vercel.json
```

## Data Flow

```
MDX Files (content/projects/*.mdx)
       ↓
Contentlayer (compile-time)
       ↓
Typed content collections
       ↓
Page components consume via generateStaticParams + getMDXComponent
       ↓
Client components hydrate with Framer Motion + Lenis
```

## Route Map

| Route | Type | Content Source | Purpose |
|---|---|---|---|
| `/` | Static | Sections + MDX references | Homepage conversion funnel |
| `/projects` | Static | Contentlayer collection | Project listing |
| `/projects/[slug]` | SSG | Individual MDX | Deep interactive case study |
| `/playground` | Static | Hardcoded components | Frontend capability demo |
| `/services` | Static | MDX page | Services detail + positioning |
| `/about` | Static | MDX page | Extended about + stats |
| `/contact` | Static | Hardcoded + form | Structured inquiry funnel |
| `/cv` | Static | Hardcoded translations | Professional CV |
| `/sitemap.xml` | Generated | All routes | SEO |

## Performance Budget

| Metric | Target |
|---|---|
| Initial JS | < 220kb |
| LCP | < 1.5s |
| CLS | < 0.05 |
| INP | < 200ms |
| Lighthouse | 95+ |
| FPS during animations | 60fps |

---

*Last updated: 2026-05-27*
