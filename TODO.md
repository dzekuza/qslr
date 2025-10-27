# Solar Panel Marketplace - TODO

## Phase 1: Foundation ✅
- [x] Initialize Next.js 14 project with TypeScript, Tailwind
- [x] Create Prisma schema, configure database (Prisma Accelerate), run migrations
- [x] Create seed script for admin account
- [x] Implement NextAuth.js v5 with credentials provider, middleware, and auth utility functions

## Phase 2: Authentication (IN PROGRESS)
- [ ] Build login page with forms and validation
- [ ] Build customer registration page
- [ ] Build vendor registration page

## Phase 3: Dashboard & Layouts
- [ ] Create admin layout, navigation, and all admin pages (vendors, products, orders management)
- [ ] Create vendor layout, navigation, and all vendor pages (products, orders, settings, Stripe)
- [ ] Create customer account pages (profile, orders, addresses) without full dashboard

## Phase 4: API Routes
- [ ] Implement all API routes for auth
- [ ] Implement API routes for vendors
- [ ] Implement API routes for products
- [ ] Implement API routes for orders
- [ ] Implement API routes for customer account

## Phase 5: Forms & Validation
- [ ] Create Zod schemas for all forms and API validation (auth, vendor, product, order)

## Phase 6: Testing & Deployment
- [ ] Test complete user flows: vendor registration → approval → product creation → order management
- [ ] Deploy to production
