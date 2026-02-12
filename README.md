# A1 Motor Group

Modern, responsive site for **A1 Motor Group** (car dealership), built with **Vite + React**, deployed on **Vercel** with **Supabase** (database + storage).

## Run locally

**Frontend only (no API):**
```bash
npm install
npm run dev
```
Opens [http://localhost:5173](http://localhost:5173). API calls will 404 unless you use full-stack dev below.

**Full stack (frontend + API):**
```bash
npm install
npm run dev:vercel
```
Runs Vite + Vercel serverless functions so `/api/*` works locally. Requires [Vercel CLI](https://vercel.com/cli) (`npm i -g vercel`).

- **Build:** `npm run build`
- **Preview:** `npm run preview`

## Environment variables

Copy `.env.example` to `.env.local` (local) and set in **Vercel** for production:

| Variable | Where | Purpose |
|----------|--------|---------|
| `SUPABASE_URL` | API (Vercel) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | API (Vercel) | Server-side DB/storage (never expose to frontend) |
| `VITE_SUPABASE_URL` | Frontend (Vercel + .env.local) | Same URL for client uploads |
| `VITE_SUPABASE_ANON_KEY` | Frontend (Vercel + .env.local) | Anon key for Storage uploads from browser |
| `ADMIN_PASSWORD` | API (Vercel) | Password for `/admin/inventory` (e.g. Domain345) |

## Supabase setup

1. Create a project and get URL + anon key + service role key.
2. Create bucket **`vehicle-photos`** (public or with policy allowing anon upload/read as needed).
3. Create tables **`vehicles`** and **`vehicle_photos`** (see Supabase docs or your schema). If `vehicles` is missing document columns, run `supabase-migration-optional.sql` in the SQL editor.

## Deploy to Vercel

1. Connect the repo to Vercel.
2. Add all env vars above in Project Settings → Environment Variables.
3. Build command: `npm run build` — Output directory: `dist`.
4. Vercel will run `/api/*` as serverless functions and serve the SPA from `/`.

Refreshing routes like `/inventory/:id` or `/admin/inventory` works: `vercel.json` rewrites non-API routes to `/`.

## Structure

- **`src/`** — React app (components, pages, utils)
- **`api/`** — Vercel serverless functions: admin auth, vin-decode, inventory CRUD, photos/commit
- **`src/utils/api.js`** — API client (credentials: include for admin)
- **`src/utils/supabaseClient.js`** — Supabase client for frontend uploads (images + PDFs)

## Routes

- **`/`** — Home (inventory section, Apply, Sell, About)
- **`/inventory/:id`** — Car detail page (gallery, specs, documents, map)
- **`/apply-for-financing`** — Financing wizard (supports `?vehicleId=`)
- **`/sell-your-car`** — Sell your car
- **`/about-us`** — About
- **`/admin/inventory`** — Admin (password-protected): add/edit vehicles, VIN decode, photos, PDFs

## Assets

`Assests/` is copied to `public/Assests` by `predev` / `prebuild`. Vehicle images and PDFs are stored in Supabase Storage (bucket `vehicle-photos`).
