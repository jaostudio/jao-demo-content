# Marketplace Demo

## Purpose
Two-sided marketplace with vendor listings, moderation, and multi-vendor cart.

## Archetype Coverage
Network Effects — two-sided marketplace, vendor onboarding, admin moderation, booking.

## What's Built
- Vendor and buyer registration (NextAuth CredentialsProvider with role in JWT)
- Vendor dashboard: manage listings, view orders
- Listing lifecycle: draft → pending_review → approved/rejected → sold/archived
- Admin moderation panel: approve/reject listings
- Multi-vendor cart: grouped by vendorId in Zustand store
- Checkout creates vendor-scoped orders with actor-guarded transitions
- Seed data: 2 vendors, 1 admin, 1 buyer, 10 listings, 2 reviews

## Architecture
- Next.js 16 App Router, Prisma + SQLite, 9 models, 6 enums
- @jaostudio/core/state-machines — listingMachine and order machines with ActorContext guards
- @jaostudio/core/events — causationId chains across order lifecycle
- NextAuth v4 CredentialsProvider with JWT role embedding

## Credentials
| Email | Role |
|---|---|
| vendor1@demo.dev | Vendor |
| vendor2@demo.dev | Vendor |
| buyer@demo.dev | Buyer |
| admin@demo.dev | Admin |

Password: `password123`

## Commands
```
npm run dev        # Start development server
npm run build      # Production build
npm run db:seed    # Re-seed database
```
