# Deploying AMHAR to Vercel

This guide walks you through deploying the AMHAR platform to Vercel with a managed PostgreSQL database.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- A [Neon account](https://neon.tech) (free tier — for PostgreSQL)
- The AMHAR repo pushed to your GitHub: `https://github.com/abidhabib/amhar-chauffeur`

## Step 1 — Create a PostgreSQL database on Neon

1. Go to https://neon.tech and sign up (free, no credit card needed)
2. Click **"Create Project"**
3. Name it `amhar` (or whatever you prefer)
4. Select the region closest to your users (for KSA: AWS Singapore or Frankfurt)
5. Click **"Create Project"**
6. On the dashboard, copy the **Connection String** — it looks like:
   ```
   postgresql://amhar_owner:xxxxxxx@ep-xxx-xxx.aws-region.neon.tech/amhar?sslmode=require
   ```
7. **Save this string** — you'll need it in Step 3

## Step 2 — Connect your GitHub repo to Vercel

1. Go to https://vercel.com and log in with GitHub
2. Click **"Add New Project"**
3. Find and select the `amhar-chauffeur` repo
4. **DON'T CLICK DEPLOY YET** — we need to configure environment variables first

## Step 3 — Configure environment variables

In the Vercel project setup page, scroll to **"Environment Variables"** and add:

| Name | Value | Environments |
|---|---|---|
| `DATABASE_URL` | `postgresql://amhar_owner:xxxxxxx@ep-xxx-xxx.aws-region.neon.tech/amhar?sslmode=require` | Production, Preview, Development |
| `DATABASE_URL_UNPOOLED` | (same Neon URL but with `-pooler` in hostname — Neon shows both) | Production, Preview, Development |

> Use the **pooled** connection string (the one with `-pooler`) for `DATABASE_URL` — it handles concurrent requests better. Neon shows both pooled and direct URLs on the dashboard.

## Step 4 — Override build settings

In the same Vercel project setup page, scroll to **"Build and Output Settings"**:

| Setting | Value |
|---|---|
| Framework Preset | Next.js (auto-detected) |
| Build Command | `prisma generate && next build` |
| Install Command | `bun install` (leave default if you use npm — Vercel auto-detects) |
| Output Directory | (leave default) |

The `prisma generate` step is critical — it generates the Prisma client before the Next.js build runs.

## Step 5 — Update `src/lib/db.ts` for production

**Before deploying**, you need to update the database client to use the real Postgres connection in production (not PGlite). Open `src/lib/db.ts` and replace the entire contents with:

```typescript
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

Then install the `pg` package:
```bash
bun add pg @types/pg
```

Commit and push this change to GitHub — Vercel will auto-deploy.

## Step 6 — Create the database tables

After the first deploy, you need to create the tables in your Neon Postgres. Run this locally (or use Vercel's CLI):

### Option A — Run locally with your Neon URL

```bash
# Clone the repo locally (if you haven't)
git clone https://github.com/abidhabib/amhar-chauffeur.git
cd amhar-chauffeur
bun install

# Set the DATABASE_URL to your Neon connection string
export DATABASE_URL="postgresql://amhar_owner:xxxxxxx@ep-xxx-xxx.aws-region.neon.tech/amhar?sslmode=require"

# Create all tables from the Prisma schema
bunx prisma db push

# Seed the database with demo data
bun run scripts/seed.ts
```

### Option B — Use Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link  # link your local folder to the Vercel project
vercel env pull .env  # pulls env vars from Vercel
bunx prisma db push
bun run scripts/seed.ts
```

## Step 7 — Verify the deployment

1. After the build completes, Vercel gives you a URL like `https://amhar-chauffeur-xxx.vercel.app`
2. Visit it — you should see the AMHAR landing page
3. Test the booking widget → search results → vehicle detail flow
4. Click **"Operator Portal"** in the footer → admin dashboard should load with the seeded data

## Common Issues

### ❌ "Prisma Client not generated"
Add `prisma generate` to the build command in Vercel:
- Settings → Build & Output Settings → Build Command: `prisma generate && next build`

### ❌ "DATABASE_URL is not set"
Make sure you added the env var in Vercel for **all environments** (Production, Preview, Development).

### ❌ "PGlite not found" or WASM errors in production
You forgot to update `src/lib/db.ts` — see Step 5. PGlite is only for local dev; production uses real Postgres.

### ❌ "Connection refused" / SSL errors
Make sure your Neon URL has `?sslmode=require` at the end.

### ❌ "Tables don't exist"
You haven't run `prisma db push` yet — see Step 6.

## Cost Expectations

| Service | Free tier limits | When you'll outgrow it |
|---|---|---|
| Vercel Hobby | 100GB bandwidth, 100GB-Hours serverless function execution | ~10k monthly visitors with bookings |
| Neon Free | 0.5GB storage, 100 compute hours/month | ~10k leads/vehicles in database |
| Total monthly cost | **$0** | When you exceed both above |

## Custom Domain (Optional)

Once deployed:
1. Buy a domain (e.g. `amharksa.com`) from Namecheap/Cloudflare/GoDaddy
2. In Vercel: Settings → Domains → Add → enter your domain
3. Follow Vercel's DNS instructions (add a CNAME record pointing to `cname.vercel-dns.com`)
4. SSL is automatic — Vercel provisions a Let's Encrypt cert for free
5. Update your domain's DNS records to point to Vercel

Wait 5–30 minutes for DNS propagation. Your site is now live at your custom domain.

## Post-Deployment Checklist

- [ ] Visit the deployed URL — home page loads
- [ ] Search a route in the booking widget → vehicle results appear
- [ ] Click a vehicle → detail page loads with reviews
- [ ] Submit a quote request → confirmation modal appears
- [ ] Click "Operator Portal" in footer → admin dashboard shows seeded data
- [ ] Create a test lead → it appears in the admin leads table
- [ ] (Optional) Set up a custom domain
- [ ] (Optional) Configure Vercel Analytics (free) — Project → Analytics tab

You're live! 🎉
