# Screenshot Inventory & Curation

Generated: 2026-06-04

## Capture Coverage

| Demo       | Screenshots Captured | Hero | Dashboard | Workflow | Admin |
| ---------- | -------------------- | ---- | --------- | -------- | ----- |
| Landing    | home, construction, dental | ✓ | — | ✓ | — |
| Commerce   | home, products, cart, checkout, admin | ✓ | ✓ | ✓ | ✓ |
| Marketplace| home, listings | ✓ | — | ✓ | — |
| Content    | home, signin, articles | ✓ | — | ✓ | — |
| WebApp     | home, signin | ✓ | — | — | — |
| Security   | home, signin, dashboard, admin, audit | ✓ | ✓ | ✓ | ✓ |

## Selected for Portfolio (3 per demo)

### Landing
1. **Hero** — `home.png` — Shows vertical selector, lead generation messaging
2. **Construction vertical** — `construction.png` — Most visually distinct vertical

### Commerce
1. **Hero** — `home.png` — Product catalog, call-to-action
2. **Checkout** — `checkout.png` — Core revenue workflow
3. **Admin** — `admin.png` — Order management dashboard

### Marketplace
1. **Hero** — `home.png` — Featured listings, vendor showcase
2. **Listings** — `listings.png` — Browse experience

### Content
1. **Hero** — `home.png` — Article grid, category navigation
2. **Articles** — `articles.png` — Published content view

### WebApp
1. **Hero** — `home.png` — Landing page with feature overview

### Security
1. **Hero** — `home.png` — Compliance messaging
2. **Dashboard** — `dashboard.png` — Post-login overview
3. **Audit** — `audit.png` — Core compliance feature

## Regeneration

To regenerate all screenshots:
```
npm run screenshots
```

Output goes to `docs/screenshots/`.

After regeneration, copy new hero images:
```
cp docs/screenshots/*/home.png jaostudio/public/images/demos/*-hero.png
```
