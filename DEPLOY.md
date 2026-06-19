# Deploying AMHAR to Vercel

Pure PostgreSQL — no SQLite, no PGlite. You need a real Postgres connection for both local dev and production.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier)
- A [Neon account](https://neon.tech) (free tier — for PostgreSQL)
- The AMHAR repo on your GitHub: `https://github.com/abidhabib/amhar-chauffeur`

---

## Step 1 — Create a PostgreSQL database on Neon (2 min)

1. Go to https://neon.tech → sign up (free, no credit card)
2. Click **"Create Project"** → name it `amhar`
3. Region: pick the one closest to your users (for KSA: AWS Singapore or Frankfurt)
4. Click **"Create Project"**
5. Copy the **pooled connection string** — it looks like:
   ```
   postgresql://amhar_owner:xxxxxxx@ep-xxx-xxx-pooler.aws-region.neon.tech/amhar?sslmode=require
   ```
   (Use the one with `-pooler` in the hostname — it handles concurrent requests better)

Save this string — you'll use it for both local dev and Vercel.

---

## Step 2 — Set up local development (3 min)

```bash
# Clone the repo
git clone https://github.com/abidhabib/amhar-chauffeur.git
cd amhar-chauffeur

# Install dependencies
bun install

# Set your DATABASE_URL (paste your Neon string)
echo 'DATABASE_URL="postgresql://amhar_owner:xxxxxxx@ep-xxx-xxx-pooler.aws-region.neon.tech/amhar?sslmode=require"' > .env

# Generate Prisma client
bun run db:generate

# Create all tables in Postgres
bun run db:setup    # runs `prisma db push`

# Seed demo data (10 vehicles, 111 reviews, 10 site reviews, 6 leads)
bun run db:seed

# Start the dev server
bun run dev
```

Open http://localhost:3000 — you should see the AMHAR landing page with seeded data.

---

## Step 3 — Connect repo to Vercel (2 min)

1. Go to https://vercel.com → log in with GitHub
2. Click **"Add New Project"**
3. Find and select the `amhar-chauffeur` repo
4. **DON'T CLICK DEPLOY YET** — configure env vars first

---

## Step 4 — Configure Vercel environment variables (1 min)

In the Vercel project setup page, scroll to **"Environment Variables"** and add:

| Name | Value | Environments |
|---|---|---|
| `DATABASE_URL` | `postgresql://amhar_owner:xxxxxxx@ep-xxx-xxx-pooler.aws-region.neon.tech/amhar?sslmode=require` | Production, Preview, Development |

> Use the **pooled** Neon URL (with `-pooler` in the hostname) for serverless environments like Vercel.

---

## Step 5 — Set the build command (1 min)

In the same Vercel setup page, under **"Build and Output Settings"**, override the Build Command:

```
prisma generate && next build
```

The `prisma generate` step is critical — it generates the Prisma client before the Next.js build runs.

Install command can stay as default (`bun install` or `npm install` — Vercel auto-detects).

---

## Step 6 — Click Deploy (1 min)

Click **"Deploy"**. Wait 2–3 minutes for the build to complete. Vercel gives you a URL like:
```
https://amhar-chauffeur-xxx.vercel.app
```

Visit it — you should see:
- ✅ Luxury AMHAR landing page with booking widget
- ✅ "Search Available Vehicles" → 10 luxury vehicles with pricing
- ✅ Click any vehicle → full detail page with reviews
- ✅ "Services" link in nav → premium services page with FAQ
- ✅ "Operator Portal" in footer → admin dashboard with seeded leads

---

## How Local Dev + Production Stay in Sync

Because both local dev and Vercel point to the **same Neon Postgres database** (via the same `DATABASE_URL`), any data you create locally shows up in production and vice versa.

**For a real production deployment**, you'd want two separate Neon projects:
- `amhar-dev` — for local development (free tier)
- `amhar-prod` — for production (Vercel env var)

But for getting started, one DB is fine.

---

## Common Issues

| Issue | Fix |
|---|---|
| `DATABASE_URL is not set` | Add the env var in `.env` locally, or in Vercel's Environment Variables UI |
| `Prisma Client not generated` | Build command must be `prisma generate && next build` |
| `Can't reach database server` | Check your Neon URL — make sure `?sslmode=require` is at the end |
| `Tables don't exist` | Run `bun run db:setup` (which runs `prisma db push`) |
| `Too many connections` | Make sure you're using the **pooled** Neon URL (with `-pooler` in hostname) |
| SSL errors | The `db.ts` client auto-detects Neon/Vercel/Supabase URLs and enables SSL — for other providers, add `?sslmode=require` to the URL |

---

## Alternative PostgreSQL Providers

If you don't want Neon, any of these work with zero code changes:

| Provider | Free tier | Notes |
|---|---|---|
| **Neon** | 0.5GB storage, 100 compute hours | Recommended — serverless, instant branching |
| **Supabase** | 500MB storage, 2 projects | Includes auth + realtime if you want it later |
| **Vercel Postgres** | 256MB storage | Built into Vercel dashboard — easiest integration |
| **Railway** | $5 free credit | Simple, generous limits |
| **Local Docker** | Unlimited | `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=amhar postgres:16` |

Just set `DATABASE_URL` to the provider's connection string and you're done.

---

## Cost Expectations

| Service | Free tier limits | When you'll outgrow it |
|---|---|---|
| Vercel Hobby | 100GB bandwidth, 100GB-Hours serverless | ~10k monthly visitors with bookings |
| Neon Free | 0.5GB storage, 100 compute hours/month | ~10k leads/vehicles in database |
| **Total monthly cost** | **$0** | When you exceed both above |

---

## Custom Domain (Optional)

Once deployed:
1. Buy a domain (e.g. `amharksa.com`) from Namecheap/Cloudflare/GoDaddy
2. In Vercel: Settings → Domains → Add → enter your domain
3. Follow Vercel's DNS instructions (add a CNAME record pointing to `cname.vercel-dns.com`)
4. SSL is automatic — Vercel provisions a Let's Encrypt cert for free
5. Update your domain's DNS records to point to Vercel

Wait 5–30 minutes for DNS propagation. Your site is now live at your custom domain.

---

## Post-Deployment Checklist

- [ ] Visit the deployed URL — home page loads
- [ ] Search a route in the booking widget → vehicle results appear
- [ ] Click a vehicle → detail page loads with reviews
- [ ] Submit a quote request → confirmation modal appears with reference number
- [ ] Click "Operator Portal" in footer → admin dashboard shows seeded data
- [ ] Create a test lead in the admin → it persists after refresh
- [ ] (Optional) Set up a custom domain
- [ ] (Optional) Configure Vercel Analytics (free) — Project → Analytics tab

You're live! 🎉
