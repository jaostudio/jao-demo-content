# Implementation Phases

## Phase 0 — Project Scaffolding

1. `npx create-next-app@15` with TypeScript + Tailwind v4 + App Router
2. Install all deps: framer-motion, lenis, @content-collections/core, contentlayer, next-themes, clsx, tailwind-merge, lucide-react, react-hook-form, @hookform/resolvers, zod, resend, @radix-ui primitives
3. Create `src/styles/tokens.css` with all design token CSS variables
4. Configure `globals.css` with Tailwind v4 `@import "tailwindcss"` + `@theme` block referencing tokens
5. Set up `cn()` utility (`clsx` + `tailwind-merge`)
6. Create `src/lib/motion/` (durations, easings, transitions, variants)
7. Install and configure Contentlayer (`contentlayer.config.ts`)
8. Update `next.config.mjs` for Contentlayer + image domains
9. Set up `next-themes` provider (dark-only default)
10. Set up Lenis provider component
11. Create layout shell (navbar placeholder + footer + children)
12. Create `<Section>`, `<Container>` primitives
13. Verify `npm run dev` works with zero errors

**Deliverable:** Running Next.js app with design system, motion constants, content pipeline, layout shell.

## Phase 1 — UI Primitives

Build all reusable primitives before composing sections:

- Typography: Heading, Text, Badge, Label
- UI: Button (primary/secondary/ghost + loading), Card, Section, Container, Grid, Separator, Skeleton
- Motion: FadeIn, Stagger, SlideIn, ScaleIn, Parallax, Magnetic
- Forms: FormField, SubmitButton, ContactForm schema + validation

**Deliverable:** Complete primitive library ready for composition.

## Phase 2 — Navbar & Footer

- Glassmorphism navbar (blur + border, transparent→solid on scroll)
- Nav links: Selected Work · Services · Playground · About
- Language toggle (EN/TL)
- Mobile hamburger with animated drawer
- Minimal footer: logo, tagline, social links, "Built with..." credit

**Deliverable:** Persistent layout chrome.

## Phase 3 — Hero Section

Highest-impact section. Split layout:
- **Left:** Credibility badge → headline (`text-7xl`) → outcome paragraph → CTA row
- **Right:** Interactive visual system (floating browser mockups with parallax)
- Violet gradient glow at top
- Staggered entrance (1.2s total), scroll-linked transforms, mouse parallax

**Deliverable:** Hero that creates the "holy shit" first impression.

## Phase 4 — Homepage Sections

Build in order — each with `<Section>` wrapper + motion entrance:

1. Social Proof Strip — horizontal badges
2. Featured Projects — asymmetric large/small layout with mockups
3. Interactive Showcase — bento grid of frontend demos
4. Services Section — service cards with problem/outcome
5. Process Timeline — 5-step horizontal scroll
6. Tech + Performance — 2-column metrics + architecture
7. About Section — split statement + stats
8. FAQ — accordion
9. CTA Section — large cinematic conversion
10. Contact Section — structured form + links

**Deliverable:** Complete homepage flow.

## Phase 5 — Case Study Pages

- Contentlayer project collection + `generateStaticParams`
- Page: Hero → Overview → Solution → Features → Tech Stack → Metrics → Live Preview → CTA
- Create 3 initial MDX case studies from existing projects
- Dynamic OG images per project
- Custom MDX components (mockup-frame, metrics-bar, tech-stack)

**Deliverable:** Deep interactive case study experience.

## Phase 6 — Playground Page

- Gallery of UI demos: 3D tilt cards, glassmorphism, scroll interactions, pricing cards, micro-interactions, magnetic buttons, parallax
- Grid layout with category filtering
- Live demo + description per card

**Deliverable:** Frontend capability demonstration page.

## Phase 7 — Supporting Pages

- `/projects` — grid listing with category filter
- `/services` — detailed services + process + pricing approach
- `/about` — extended about with workflow, philosophy, stats
- `/contact` — form + Calendly + social links
- `/cv` — upgraded CV in new design system

## Phase 8 — SEO & Analytics

- Metadata factory (`src/lib/seo/metadata.ts`)
- JSON-LD structured data (Person, Portfolio, WebSite)
- Dynamic OG images via `next/og`
- Sitemap + robots.txt
- PostHog/Plausible integration
- Track: page views, project clicks, CTA clicks, scroll depth, submissions

## Phase 9 — Polish & QA

Checklist:
- [ ] All pages render without errors
- [ ] 60fps animations throughout
- [ ] Mobile feels native-quality
- [ ] Touch interactions work
- [ ] Lenis feels premium
- [ ] Form validation works
- [ ] EN/TL toggle works globally
- [ ] All Contentlayer content loads
- [ ] Lighthouse 95+
- [ ] No console errors
- [ ] Keyboard nav + focus states + ARIA
- [ ] Responsive: 360, 768, 1024, 1440, 1920
- [ ] <220kb JS, <1.5s LCP
- [ ] Reduced motion respected

## Phase 10 — Deployment

- Push to GitHub → Vercel
- Configure env vars (Resend, analytics)
- Custom domain
- Production Lighthouse audit
- Test contact form end-to-end
- Verify OG images on social platforms
- Submit sitemap to Google Search Console

---

*Last updated: 2026-05-27*
