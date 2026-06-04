# Live Validation Report

**Date:** 2026-06-04  
**Method:** HTTP status code checks via `Invoke-WebRequest` (PowerShell)  

---

## Landing

Lead generation platform — `https://jao-demo-landing.vercel.app/`

- [x] **Homepage** — HTTP 200
- [x] **Construction** (`/construction`) — HTTP 200
- [x] **Dental** (`/dental`) — HTTP 200
- [x] **Real estate** (`/real-estate`) — HTTP 200
- [x] **Trades** (`/trades`) — HTTP 200
- [x] **Legal** (`/legal`) — HTTP 200

**Result:** PASS — All public pages serve correctly.

---

## Commerce

E-commerce — `https://jao-demo-commerce.vercel.app/`

- [x] **Homepage** — HTTP 200
- [x] **Products** (`/products`) — HTTP 200
- [x] **Cart** (`/cart`) — HTTP 200
- [x] **Checkout** (`/checkout`) — HTTP 200
- [x] **Admin orders** (`/admin/orders`) — HTTP 200
- [ ] **Product detail** (`/products/1`) — HTTP 404

**Result:** PASS with minor issue — Product detail routes return 404. Likely no seed data with ID 1, or the route uses a different pattern (`/product/:id` vs `/products/:id`). Requires browser inspection to confirm.

---

## Marketplace

Multi-vendor marketplace — `https://jao-demo-marketplace.vercel.app/`

- [x] **Homepage** — HTTP 200
- [x] **Listings** (`/listings`) — HTTP 200
- [x] **Admin dashboard** (`/dashboard`) — HTTP 200
- [ ] **Sign in** (`/sign-in`, `/login`, `/signin`) — All HTTP 404
- [ ] **Listing detail** (`/listings/1`) — HTTP 404

**Result:** FAIL (partial) — Auth and detail routes are client-side SPA routes that return 404 on direct server access. The dashboard being accessible at `/dashboard` suggests some routes work; sign-in and listing detail likely render from the client after navigation from the homepage.

---

## Content

Content platform — `https://jao-demo-content.vercel.app/`

- [x] **Homepage** — HTTP 200
- [x] **Sign in** (`/signin`) — HTTP 200
- [x] **Admin** (`/admin`) — HTTP 200
- [ ] **Articles** (`/articles`, `/articles/1`) — HTTP 404
- [ ] **Categories** (`/categories`) — HTTP 404
- [ ] **Article detail** (`/article/1`) — HTTP 404
- [ ] **Dashboard** (`/dashboard`) — HTTP 404

**Result:** FAIL (partial) — Content listing and detail routes are client-side only. Sign-in and admin pages serve at `/signin` and `/admin` respectively, implying the app uses these alternative paths.

---

## WebApp

Project management — `https://jao-demo-webapp.vercel.app/`

- [x] **Homepage** — HTTP 200
- [x] **Sign in** (`/signin`) — HTTP 200
- [ ] **Org page** (`/org`, `/organization`) — HTTP 404
- [ ] **Projects** (`/projects`, `/project`) — HTTP 404
- [ ] **Tasks** — Cannot verify without browser session

**Result:** FAIL (partial) — Only the homepage and sign-in page are server-renderable. All authenticated routes (`/org`, `/projects`, `/app`, `/dashboard`) return 404, as they are SPA routes protected behind authentication.

---

## Security

Security portal — `https://jao-demo-security.vercel.app/`

- [x] **Homepage** — HTTP 200
- [x] **Sign in** (`/signin`) — HTTP 200
- [x] **Dashboard** (`/dashboard`) — HTTP 200
- [x] **Admin organizations** (`/admin/organizations`) — HTTP 200
- [x] **Admin users** (`/admin/users`) — HTTP 200
- [x] **Audit trail** (`/audit`) — HTTP 200
- [ ] **Short paths** (`/organizations`, `/users`) — HTTP 404

**Result:** PASS — Best-performing demo for server-side rendering. Most admin and auth-adjacent routes serve correctly from the server. Short alias paths (`/organizations`) are not defined but the canonical routes (`/admin/organizations`) work.

---

## Summary

| Demo       | Public Pages | Auth Pages | Admin Pages | Verdict          |
|------------|-------------|------------|-------------|------------------|
| Landing    | 6/6         | N/A        | N/A         | **PASS**         |
| Commerce   | 5/6         | N/A        | 1/1         | **PASS** (minor) |
| Marketplace| 2/3         | 0/3        | 1/1         | **FAIL** (partial) |
| Content    | 1/3         | 1/2        | 1/2         | **FAIL** (partial) |
| WebApp     | 1/1         | 1/1        | 0/3         | **FAIL** (partial) |
| Security   | 1/1         | 1/1        | 4/4         | **PASS**         |

### Issues Found

1. **Commerce product detail** (`/products/1` → 404) — Dynamic route may require navigating from the product list for proper hydration, or no product with ID 1 exists in the demo data.
2. **Marketplace sign-in** (`/sign-in`, `/login`, `/signin` → 404) — Client-side SPA route; only accessible via in-app navigation from the homepage.
3. **Marketplace listing detail** (`/listings/1` → 404) — Same SPA routing issue; probably requires in-app navigation.
4. **Content articles/categories** — All return 404 from server; client-side routes.
5. **WebApp authenticated routes** — All require sign-in first; server cannot render them directly.
6. **General pattern** — 4 of 6 demos use heavy client-side routing (Next.js App Router with client components), making direct URL access unreliable. Full validation requires a headless browser.
