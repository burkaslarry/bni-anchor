# BNI Anchor — Next.js + MongoDB Atlas

Modern member directory with an admin portal for photos and profile text. Deploy on **Vercel**; database on **[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)** (free M0); avatars on **Vercel Blob** (free Hobby tier covers ~100 headshots easily).

The legacy static site at the repo root (`index.html`, GitHub Pages) stays in place until you cut DNS to Vercel.

## Why this stack

| Layer | Choice | Reason |
|-------|--------|--------|
| UI | **Next.js 16 (App Router)** | Fast loads (SSR/ISR), SEO, API routes in one repo |
| DB | **MongoDB Atlas M0** | Free tier, flexible member documents, works well with Vercel |
| Photos | **Vercel Blob + sharp** | Runtime upload (not `public/`), auto crop + WebP |
| Auth | **HTTP-only JWT cookie** | Simple chapter admin; no public sign-up |

Alternatives: **Astro** (great static + islands) or **Remix** — Next.js is the default here because Vercel Blob, ISR, and admin API routes are first-class.

## Local development

```bash
cd web
cp .env.example .env.local
# Fill MONGODB_URI, ADMIN_*, optional BLOB_READ_WRITE_TOKEN
npm install
npm run dev
```

- Without `MONGODB_URI`, the public site uses `data/members.seed.json` (exported from legacy `js/members.js`).
- Without Blob token, keep avatars under `public/images/members/` and set `avatarUrl` manually or skip upload.

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## MongoDB Atlas setup

1. Create a free **M0** cluster on Atlas.
2. Database Access → create a DB user (password auth).
3. Network Access → allow your IP (or `0.0.0.0/0` for Vercel only after you understand the risk; prefer Atlas **Vercel integration**).
4. Connect → Drivers → copy `mongodb+srv://…` into `MONGODB_URI`.
5. Sign in to admin → **Seed / refresh from legacy JSON** once to load 41 members.

## Vercel deploy

1. Import the GitHub repo in Vercel.
2. Set **Root Directory** to `web`.
3. Add environment variables from `.env.example`.
4. Storage → **Create Blob store** → `BLOB_READ_WRITE_TOKEN` is injected automatically.
5. Deploy. Point `bni-anchor.com` (or keep `*.vercel.app`) when ready.

## Admin features

- Add / edit / delete members (ZH + EN fields, category, sort order, publish flag).
- **Website URL** on company (shown as link in modal).
- Upload photo → server **center-biased square crop** → **512×512 WebP** → Blob URL saved in MongoDB.

## Photo pipeline

```
Admin file → POST /api/admin/upload-avatar
  → sharp (rotate, crop, resize, WebP)
  → Vercel Blob public URL
  → stored on member.avatarUrl
```

## Scripts

```bash
npm run seed   # CLI seed to Atlas (requires MONGODB_URI in env)
npm run build
```

## Security notes

- Never expose `MONGODB_URI`, `ADMIN_PASSWORD`, or `BLOB_READ_WRITE_TOKEN` to the browser.
- Rotate `ADMIN_PASSWORD` when officers change.
- Prefer Vercel **Preview** env vars separate from Production.
