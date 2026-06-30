# Brand Assets — Likha

## Logo

| Variant | File | Usage |
|---|---|---|
| Wordmark | `public/demo/logos/likha-wordmark.svg` | Light backgrounds (homepage header) |
| Icon mark | `public/demo/logos/likha-icon.svg` | Favicon, mobile nav, social preview |

Note: Likha uses a studio-wordmark approach — the brand is represented by its logotype in the Inter font family rather than a separate emblem. SVG icon marks are used for favicon contexts only.

### Logo Rules

- Always use official logo files. No text-based recreations, emoji stand-ins, or CSS approximations.
- Minimum clear space: height of the logo on all sides.
- Do not rotate, stretch, recolor, or add effects to the logo.
- Do not place the logo on backgrounds with insufficient contrast.

## Icons

| Icon | Source | Usage |
|---|---|---|
| Lucide icons | `lucide-react` | All interface icons (Sun, Moon, Search, Plus, Chevron, etc.) |
| Shield | Custom (inline SVG) | Admin badge in header |
| Avatar | Custom SVGs in `/demo/artists/` | User profile avatars |

### Icon Rules

- Use Lucide icon set consistently. No mixing with Phosphor, Heroicons, or other libraries.
- Icons must have `aria-label` or `title` for accessibility.
- Custom icons (shield, SVG artwork) follow the same 24x24 viewport convention as Lucide.

## Images

| Asset | File | Usage |
|---|---|---|
| Guardian character | `public/demo/works/guardian-final.svg` | Work detail / header image for Character Design article |
| Guardian armor | `public/demo/works/guardian-armor.svg` | Version 3 media for Guardian |
| Guardian sketch | `public/demo/works/guardian-sketch.svg` | Version 2 media for Guardian |
| Anatomy study | `public/demo/works/anatomy-final.svg` | Work thumbnail for Anatomy Studies |
| Anatomy refinement | `public/demo/works/anatomy-refinement.svg` | Version 2 media |
| Mural final | `public/demo/works/mural-final.svg` | Work thumbnail for Mural Project |
| Mural sketches | `public/demo/works/mural-sketches.svg` | Version 2 media |
| Mural progress | `public/demo/works/mural-progress.svg` | Version 3 media |
| Letterpress final | `public/demo/works/letterpress-final.svg` | Work thumbnail for Letterpress article |
| Letterpress process | `public/demo/works/letterpress-process.svg` | Version 2 media |
| Accessibility system | `public/demo/works/accessibility-system.svg` | Work thumbnail for Accessibility article |
| Manila street | `public/demo/works/manila-street.svg` | Work thumbnail for Street Photography |
| Audio card | `public/demo/works/audio-card.svg` | Work thumbnail for Audio Diaries |
| Process notes | `public/demo/works/process-notes.svg` | Work thumbnail for Process Documentation guide |
| Artist: Sarah Chen | `public/demo/artists/sarah-avatar.svg` | Author profile image |
| Artist: Marcus Rivera | `public/demo/artists/marcus-avatar.svg` | Author profile image |
| Editor: Maya Santos | `public/demo/artists/editor-avatar.svg` | Admin profile image |
| Artist: Tala Cruz | `public/demo/artists/tala-avatar.svg` | Author profile image |
| Artist: Leo Reyes | `public/demo/artists/leo-avatar.svg` | Author profile image |
| Collection: Process | `public/demo/collections/process-studies.svg` | Collection cover |
| Collection: Human-Made | `public/demo/collections/human-made.svg` | Collection cover |

### Image Rules

- All images have alt text. Decorative images use `alt=""`.
- SVG assets used directly (scalable, no lazy-load needed for demo).
- No placeholder images in production.
- All screenshot artifacts go under `docs/artifacts/screenshots/`.

## Typography Assets

| Asset | Source | Usage |
|---|---|---|
| Inter | Google Fonts (system font stack fallback) | All UI, body text, and headings |
| JetBrains Mono | Google Fonts | Code blocks and monospace contexts |

### Font Rules

- Font files loaded via `<link>` in layout head with `font-display: swap`.
- Two font families maximum. No additional fonts without design review.
- Inter variable font preferred (weight range 300-700).

## Asset Directory

```
public/
  demo/
    works/           — SVG artwork for work thumbnails and headers
    artists/         — SVG artist avatars
    collections/     — SVG collection covers
    logos/           — Brand logo assets
docs/
  artifacts/
    screenshots/     — Route QA screenshots
    reports/         — Launch readiness reports
```
