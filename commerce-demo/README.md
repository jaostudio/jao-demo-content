# Sari‑Sari Demo – Filipino Corner Store Online

Mabuhay! Sari‑Sari is a full‑featured e‑commerce demo of a nostalgic Filipino corner store. Bilingual (EN/TL), dark mode, admin dashboard, simulated payments — all built with Next.js 16.

## Quick Start

```bash
npm install
npx prisma generate
npm run db:seed
npm run dev
```

Visit `http://localhost:3000`. Use the floating Demo Control Panel (bottom‑right) to switch roles.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@sari-sari.demo` | `customer123` |
| Admin | `admin@sari-sari.demo` | `password123` |

## Features

- **Product catalog** — 24 nostalgic products across 6 categories, with search + filter
- **Cart** — tawad codes (SENIOR, TAWAD, SARI, SUKING), bundle discounts, sukli points
- **Checkout** — COD + simulated GCash modal
- **Orders** — cancel within 5 min, request returns (customer) / approve returns (admin)
- **Favorites & notifications** — like products, get notified on order status changes
- **Admin panel** — manage orders, products, bundles, flash sales, returns, reports, announcements
- **Bilingual UI** — EN/TL toggle via footer, persists across pages
- **Dark mode** — follows OS preference, toggleable
- **Demo control panel** — role switcher (guest / customer / admin), slow network simulation, data reset
- **Accessibility** — WCAG 100% on all audited pages (LiveViewer CLI, 44–96 checks per page)
- **Security** — admin middleware guard, security headers (HSTS, X‑Frame‑Options, X‑Content‑Type‑Options, Referrer‑Policy), robots.txt blocking /admin/ and /api/

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router (Turbopack) |
| Database | Prisma + SQLite (Turso for remote) |
| State | Zustand (cart, persisted to localStorage) |
| Auth | NextAuth v5 (CredentialsProvider, JWT with role) |
| Styles | Tailwind CSS v4 (Philippine flag colors) |
| i18n | Custom EN/TL with cookie + custom events |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Turso (remote DB)
DATABASE_URL="libsql://..."
DATABASE_AUTH_TOKEN="..."

# Local SQLite fallback
# DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (`localhost:3000`) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:seed` | Re‑seed database with demo data |
| `npx prisma studio` | Browse database (local) |

## Deployment

Recommended: **Vercel + Turso**. Set 4 env vars in Vercel dashboard (`DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).

For local presentations: `npx next build && npx next start`

## License

MIT — see [LICENSE](LICENSE).
