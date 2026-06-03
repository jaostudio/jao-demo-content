# Content Guidelines

## Adding a New Project

1. Add project data to `src/lib/projects.ts` — include slug, title, description, industry, type, deliverables, outcome, tier, gallery paths, live URL, and related slugs.
2. The `[slug]/page.tsx` renders automatically via `generateStaticParams`.
3. Add screenshots:
   - Run `npm run qa:screenshots -- --url https://your-domain.com`
   - Or manually place files at `public/projects/{slug}/hero.webp` and `public/projects/{slug}/detail.webp`
4. The project page renders gallery images when `gallery.length > 0`; falls back to "Visual assets coming soon" text when empty.
5. If the project should appear on the CV page, add its slug to `cvProjectSlugs` in `src/lib/cv-config.ts`.

## Text Tone

- Concise and direct. No filler.
- One idea per paragraph.
- Bullet lists for features, deliverables, or criteria.
- Avoid jargon unless the target audience expects it.
- No pricing numbers — use relative bands ("short timeline", "medium complexity", "extended build").
- No 24/7 support claims or template customization offers.

## Image Specs

- **Format**: WebP
- **Aspect ratio**: 16:10
- **File size**: 20–50 KB per image
- **Location**: `public/projects/{slug}/hero.webp`, `public/projects/{slug}/detail.webp`

## Metadata

- Title template: `{Page Title} — JAOstudio`
- Descriptions: 120–160 characters, summarize the page content.
- OG images: Project detail pages use dynamic OG generation via `opengraph-image.tsx`.

## What NOT to Do

- Do not hardcode `@id` values in JSON-LD — use constants from `src/lib/json-ld-ids.ts`.
- Do not add raw duration/easing values — import from `src/lib/motion-variants.ts`.
- Do not add routes outside `src/lib/seo-config.ts`.
- Do not add CTA labels outside `src/lib/cta-policy.ts`.
- Do not add new analytics providers.
- Do not add pricing numbers or negotiation anchors.
