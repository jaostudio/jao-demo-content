# Commerce Demo

## Purpose
Full e-commerce lifecycle — product catalog, cart, checkout, order management.

## Archetype Coverage
Transactional Commerce — products, cart, checkout, admin order processing.

## What's Built
- Product catalog with category filter + product detail pages
- Client-side shopping cart (Zustand, localStorage-persisted)
- Checkout flow with order creation
- Order confirmation page
- Admin dashboard for order management (process, ship, return, refund)

## Architecture
- Next.js 16 App Router, Prisma + SQLite
- @jaostudio/core/state-machines — paymentMachine + fulfillmentMachine with actor-guarded transitions
- @jaostudio/core/events — emit.orderCreated, emit.orderTransitioned
- NextAuth v4 CredentialsProvider for admin auth

## Credentials
| Email | Role |
|---|---|
| admin@demo.dev | Admin |

Password: `password123`

## Commands
```
npm run dev        # Start development server
npm run build      # Production build
npm run db:seed    # Re-seed database
```
