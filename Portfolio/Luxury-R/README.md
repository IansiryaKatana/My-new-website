# Luxury R — Marcellaro Real Estate

TanStack Start (React 19 + TypeScript + Vite) luxury real estate landing page with Supabase CMS admin.

## Stack

- **Frontend:** TanStack Start, React 19, TanStack Router, Tailwind CSS v4
- **UI:** Radix UI primitives (shadcn-style), Embla Carousel, Lucide icons
- **Backend:** Supabase (Postgres, Auth, Storage)

## Quick start

```bash
npm install
cp .env.example .env
# Add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the CMS.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `supabase/migrations/20260527000000_luxury_cms.sql` in the SQL editor.
3. Optionally run `supabase/seed.sql` for demo content.
4. Create a Storage bucket `cms-media` (public) for media uploads.
5. Enable Email auth and create an admin user in Authentication.
6. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

First login auto-creates an `admin_users` row with role `owner`.

## Seed CMS (live data + RPC)

The public site loads content via `get_public_cms_snapshot()` RPC (single call), with fallback to parallel table queries.

**Option A — Service role (recommended)**

1. Copy the **service_role** key from Supabase → Project Settings → API into `.env`:

   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run:

   ```bash
   npm run seed:cms
   ```

**Option B — SQL Editor**

Paste and run the entire file `supabase/seed_full.sql` in the [Supabase SQL Editor](https://supabase.com/dashboard/project/ktrzhubjqcegskpnfvbh/sql/new). This seeds all content and creates the RPC.

After seeding, refresh the site — `CmsContext` will use **live** mode (no hardcoded fallback except empty tables).

## CMS modules

| Route | Content |
|-------|---------|
| `/admin` | Dashboard + recent leads |
| `/admin/properties` | Property listings |
| `/admin/testimonials` | Client stories |
| `/admin/team` | Team profiles |
| `/admin/faqs` | FAQ accordion |
| `/admin/process` | Process slider steps |
| `/admin/submissions` | Contact form inbox |
| `/admin/site` | Branding & global copy |

Public pages load published content via `loadCmsSnapshot()` and fall back to `src/data/cms-fallback.json` when Supabase is offline or empty.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
