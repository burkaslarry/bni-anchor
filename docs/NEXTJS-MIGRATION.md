# BNI Anchor — static site → Next.js + MongoDB Atlas

## Current state

| Path | Role |
|------|------|
| `/` (repo root) | **Legacy** GitHub Pages site (`index.html`, `js/members.js`, `images/`) — still live |
| `/web` | **New** Next.js app — member directory + admin portal |

## Recommended stack (implemented in `/web`)

- **Next.js 16 (App Router)** — fast first load, SEO, API routes, deploy on Vercel
- **[MongoDB Atlas M0](https://www.mongodb.com/products/platform/atlas-database)** — member profiles (free tier)
- **Vercel Blob** — avatar uploads after **sharp** crop/compress (not runtime writes to `public/`)
- **Admin auth** — `ADMIN_PASSWORD` + signed HTTP-only cookie (`ADMIN_SESSION_SECRET`)

### Why not ImgBB for production?

Third-party free hosts are fine for experiments; chapter site should own URLs on Blob/R2. ~100 WebP headshots ≈ 5–8 MB → well within Vercel Blob Hobby free tier.

### Framework alternatives

| Framework | When to pick |
|-----------|----------------|
| **Next.js** (chosen) | Admin API + Vercel + ISR in one repo |
| **Astro** | Mostly read-only marketing + small React island for search |
| **Remix** | Strong forms/actions; slightly more setup on Vercel |

## Cutover checklist

1. Atlas: create M0 cluster, user, allow Vercel IPs (or use Atlas–Vercel integration).
2. Vercel: import repo, **Root Directory = `web`**, add env vars from `web/.env.example`.
3. Vercel Storage → Blob store.
4. Deploy → `/admin/login` → **Seed** from legacy JSON.
5. Re-upload avatars where needed (auto crop WebP).
6. Point domain to Vercel; keep GitHub Pages as fallback until verified.
7. Optional: sync check-in API on Render to read same MongoDB later.

## Local commands

```bash
cd web && cp .env.example .env.local && npm run dev
cd web && npm run seed   # requires MONGODB_URI
```

See [web/README.md](../web/README.md) for full detail.
