# DC Valeting — Premium Detailing Landing Page

## Problem statement
Build a premium ultra-modern automotive valeting landing page for "DC Valeting" with a black/charcoal/silver/white monochrome luxury aesthetic, inspired by high-end automotive brands. Include a sticky transparent navbar with top info bar, cinematic hero with split layout, multi-step floating booking panel, package cards (Stage 1 / Stage 2 paint correction + ceramic add-ons), why-choose grid, recent results gallery, reviews, CTA banner and luxury footer. Edinburgh-based business.

## Architecture
- **Frontend**: React 19 + Tailwind + shadcn/ui (Calendar, Sonner) + lucide-react icons. Bebas Neue + Oswald (display) and Inter (body) via Google Fonts.
- **Backend**: FastAPI + Motor (MongoDB) — bookings collection.
- **Animations**: IntersectionObserver-based scroll reveal hook (`useReveal`), CSS keyframes (float, marquee, shimmer), parallax via scrollY transform.

## Core requirements (static)
- Monochrome black/silver/white aesthetic, no gold
- Sticky transparent navbar that solidifies on scroll
- 4-step booking flow with persisted bookings in MongoDB
- Edinburgh contact details: 07949 123 456 / dcvaleting@outlook.com

## What's implemented (2026-05-27)
- Top info bar with 4 trust badges
- Sticky navbar (transparent → solid on scroll) with mobile menu
- Hero: split layout, large display headline, two CTAs, glossy car image with spotlight + reflective floor + floating particles, stats bar, floating availability tag, rating card
- Floating glassmorphism BookingPanel (desktop: pinned inside Hero; mobile: FAB-triggered modal). 4-step flow: Service & Size → Calendar Date & Time slots → Details → Confirm. Submits to `POST /api/bookings`.
- Features strip (4 cards: Fully Insured, Quality Products, Attention To Detail, Mobile Service)
- Packages: Stage 1 Enhancement + Stage 2 Full Correction (featured), with checklists, pricing tiers, day-service badges
- Ceramic add-ons (1Y / 3–5Y) horizontal cards
- Why Choose grid (4 cards: Experienced, Passion, Convenient, Satisfaction)
- Gallery: masonry-style columns with hover zoom + label overlay
- Reviews section with 5-star testimonials
- CTA banner with 3-step "How it works" + book button
- Luxury 5-column footer with social, services, company, info, contact + copyright

## Backend endpoints
- `GET /api/` — health
- `POST /api/bookings` — create booking (validates email)
- `GET /api/bookings` — list bookings
- `GET /api/bookings/{id}` — retrieve booking (404 on missing)

## User personas
- Edinburgh-area car owners seeking premium detailing
- Performance/luxury vehicle owners considering paint correction & ceramic coating
- Fleet/business owners exploring monthly maintenance plans

## Testing status
- Iteration 1: 100% backend (7/7), 100% frontend critical flows. End-to-end booking submission verified.

## Backlog / Next priorities
- **P1** Admin dashboard at `/admin` to view bookings (revenue visibility)
- **P1** Email notification on booking (Resend integration) — needs Resend API key
- **P2** Real before/after image swap component in gallery
- **P2** FAQ accordion section
- **P2** Phone validation (regex), local-date formatter in booking (avoid UTC off-by-one)
- **P3** Return 201 from POST /api/bookings; migrate FastAPI shutdown to lifespan
