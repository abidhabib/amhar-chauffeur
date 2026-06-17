# AMHAR — Luxury Chauffeur & Lead Management Platform

A premium, quote-based chauffeur booking and lead management platform for **AMHAR Premier Chauffeur Service** (Riyadh, Saudi Arabia). Built with Next.js 16, TypeScript, Prisma, and a polished mix-theme luxury design system (ivory base + charcoal contrast sections + champagne gold accents).

> **Note on architecture:** The original brief specified Laravel + Vue. This implementation uses Next.js + React (the available sandbox runtime) but preserves every architectural principle requested — service layer, DTO validation, repository pattern, event-driven status updates, Pinia-equivalent state management, strict UI consistency. The patterns map 1:1 to Laravel/Vue if a port is needed later.

---

## ✨ Features

### Public Landing
- **Cinematic hero** with parallax background, layered warm gradients, gold accent typography
- **Six service cards** (Airport Transfer, Corporate, City-to-City, Hotel, Hourly Charter, Middle East Transfer) with hover lift + gold-underline CTAs
- **Auto-scrolling fleet carousel** — infinite horizontal scroll with pause-on-hover, 16 luxury vehicles (Rolls Royce, Mercedes S-Class, BMW 7, Audi A8, etc.)
- **3-step "How it works"** in dramatic charcoal contrast section with animated gold numbers
- **Testimonials** with aggregate rating, star ratings per card, hover lift effect
- **Footer CTA** with radial gold glow + dual CTAs (Quote + WhatsApp)
- **Cursor follower** gold glow (desktop only, respects `prefers-reduced-motion`)
- **Magnetic CTAs** that subtly track the cursor on primary buttons
- **Scroll-spy nav** with gold underline for active section
- **Reveal-on-scroll** animations via IntersectionObserver

### Booking Modal (4-step quote request)
- **Step 1: Journey** — pickup, destination, date, time
- **Step 2: Vehicle** — category cards with checkmark selection, passenger/luggage steppers, notes
- **Step 3: Contact** — name, WhatsApp (with country code), email
- **Step 4: Review** — full summary before submission
- **Success state** with reference number + WhatsApp quick action
- Generates unique reference (`AMH-YYYY-XXXX`) per lead
- Pre-fills vehicle when triggered from a fleet card

### Admin Operator Portal (accessed via footer "Operator Portal" link)
- **Dashboard** — KPI cards, lead-volume chart, status breakdown, recent activity feed
- **Leads** — full table with filters (status, search), detail drawer with:
  - Status workflow (new → contacted → quoted → confirmed → cancelled)
  - Assignment to operators
  - Internal timeline notes (note / status_change / assignment / quote_sent)
  - WhatsApp / Call / Email quick actions
- **Fleet** — CRUD with visibility toggle, display order, features list
- **Reviews** — moderation (pending/approved/featured) with one-click actions
- **Team** — role management (super_admin / manager / operator) with active toggle
- **Audit Log** — filterable activity trail of every meaningful action

---

## 🏗 Architecture

```
src/
├── app/
│   ├── api/                    # Next.js API routes (thin controllers)
│   │   ├── leads/              #   POST (public), GET (admin), PATCH (status/assign)
│   │   │   └── [id]/notes/     #   POST timeline note
│   │   ├── fleet/              #   CRUD
│   │   ├── reviews/            #   CRUD + moderation
│   │   ├── users/              #   List + role/active toggle
│   │   ├── stats/              #   Dashboard analytics
│   │   └── activity/           #   Audit log
│   ├── globals.css             # Luxury design system (mix theme)
│   ├── layout.tsx              # Root layout with Inter font
│   └── page.tsx                # Single-page app entry (view-switch between landing/admin)
│
├── lib/
│   ├── dto/                    # Zod validation schemas (lead, fleet, review)
│   ├── repositories/           # Pure data-access layer (Prisma)
│   ├── services/               # Business logic + event emission
│   ├── events/                 # EventEmitter for lead lifecycle
│   ├── db.ts                   # Prisma client singleton
│   ├── api-client.ts           # Typed fetch wrapper for admin
│   └── utils.ts                # cn() helper
│
├── stores/                     # Zustand stores (Pinia-equivalent)
│   ├── view-store.ts           #   landing vs admin + active admin section
│   ├── booking-store.ts        #   booking modal state + preselection
│   └── actor-store.ts          #   current admin user (mock auth)
│
├── hooks/
│   └── use-magnetic.ts         # Cursor-follow hook for primary CTAs
│
└── components/
    ├── shared/                 # LuxuryButton, CursorGlow, Reveal
    ├── landing/                # Nav, Hero, ValueProps, FleetShowcase, HowItWorks, Testimonials, Footer
    ├── booking/                # 4-step BookingModal
    └── admin/                  # AdminShell, Sidebar, Dashboard, LeadsTable, FleetManager, ReviewsModeration, UserControl, AuditLog
```

### Architectural Principles Enforced
- **Service layer** — `src/lib/services/*.service.ts` orchestrates business logic; controllers are thin
- **Repository pattern** — `src/lib/repositories/*.repository.ts` handles raw Prisma access only
- **DTO validation** — Zod schemas in `src/lib/dto/*.dto.ts` validate every API input
- **Event-driven** — `src/lib/events/lead-events.ts` decouples status updates from side effects (activity logging, future notifications)
- **State management** — Zustand stores mirror Pinia's pattern (view, booking modal, actor)
- **Strict UI consistency** — all buttons go through `LuxuryButton` (4 variants), all inputs use `.amhar-input`, all sections use `Reveal` for entrance

---

## 🎨 Design System

### Color Palette (Mix Theme)
| Token | Value | Usage |
|---|---|---|
| `--background` | `#f6f1e9` | Ivory base |
| `--card` | `#fffdf8` | Cream cards |
| `--foreground` | `#1a1612` | Deep espresso text |
| `--charcoal` | `#1f1a14` | Contrast sections (How it works, Footer) |
| `--gold` | `#b08842` | Primary accent (deep champagne) |
| `--gold-bright` | `#d4b876` | Hover / highlights |
| `--gold-soft` | `#e0c982` | Gradient end |
| `--champagne` | `#e8d4a8` | Subtle accents |
| `--bronze` | `#8a6d3b` | Gradient end |
| `--muted-foreground` | `#6b5d4f` | Warm taupe body text |

### Typography
- **Font:** Inter (300, 400, 500, 600, 700)
- **Display:** `clamp(2.75rem, 6.5vw, 5.5rem)` / weight 300
- **Headline:** `clamp(2rem, 3.5vw, 3rem)` / weight 400
- **Body large:** 1.125rem / weight 400 / line-height 1.75
- **Eyebrow:** 0.75rem / weight 600 / tracking 0.26em / uppercase

### Motion
- **Duration range:** 200–500ms
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (premium ease-out)
- **No flashy animations** — subtle hover lift (4px), gold border glow, scale-105 on images

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (or Bun)
- SQLite (file-based — no external DB needed)

### Install & Run

```bash
# Install dependencies
bun install
# or: npm install

# Set up the database
bun run db:push
# or: npx prisma db push

# Seed the database with sample data (3 users, 16 vehicles, 10 reviews, 6 leads)
bun run scripts/seed.ts
# or: npx tsx scripts/seed.ts

# Start the dev server
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Portal Access
- Scroll to the **footer** → click **"Operator Portal"** (subtle link next to Privacy)
- The "logged-in" operator is auto-set to **Mir Abdullah** (super_admin from the seed) — no auth required for the demo
- In production, wire up NextAuth.js for real authentication

### Admin Users (seeded)
| Email | Name | Role |
|---|---|---|
| `mir@amharksa.com` | Mir Abdullah | super_admin |
| `basit@amharksa.com` | Basit Khan | manager |
| `murtada@amharksa.com` | Murtada Ali | operator |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + custom luxury design tokens |
| UI primitives | shadcn/ui (New York) + Lucide icons |
| Database | Prisma ORM (SQLite) |
| State | Zustand (client) + TanStack Query (server, available) |
| Animations | Framer Motion |
| Validation | Zod |
| Auth | NextAuth.js v4 (available, not wired in demo) |

---

## 📜 Available Scripts

```bash
bun run dev          # Start dev server on port 3000
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:push      # Push Prisma schema to SQLite
bun run db:generate  # Regenerate Prisma client
bun run db:migrate   # Create a migration
bun run db:reset     # Reset database (destroys all data)
```

---

## 🔐 Security Notes

- **No online payment** — quote-based, all payments handled offline (industry standard for KSA chauffeur market)
- **No pricing displayed** — quotes given per-booking via WhatsApp/phone
- **reCAPTCHA** ready (placeholder in booking form — add your site key in production)
- **CSRF protection** — built into Next.js API routes via same-origin checks
- **Audit log** — every admin action is recorded with actor, IP, and metadata

---

## 📁 Project Structure Notes

- **Single-page app** — the `/` route handles both landing and admin via a Zustand view store (sandbox constraint). In production, split into `/` (landing) and `/admin/*` (panel) routes.
- **Mock auth** — admin shell auto-assigns the first super_admin as the actor. Replace with NextAuth session in production.
- **SQLite** — file-based, perfect for demo. For production, swap to PostgreSQL by changing the `DATABASE_URL` and Prisma datasource provider.

---

## 📄 License

Private project for AMHAR Premier Chauffeur Service. All rights reserved.

---

## 🙏 Acknowledgments

- Fleet photography: Unsplash
- Review data: Adapted from real AMHAR client testimonials (names anonymized)
- Design inspiration: Rolls Royce, Bentley, Aston Martin digital presence
