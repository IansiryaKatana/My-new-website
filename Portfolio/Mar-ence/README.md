# Valence Capital — TanStack Start + Supabase CMS

Premium institutional investment firm landing page with an embedded admin CMS at `/admin`.

## Stack

- **TanStack Start** (React 19, TypeScript, Vite 8)
- **Tailwind CSS v4**
- **Radix UI** + shadcn-style components
- **Framer Motion** (editorial reveals, reduced-motion safe)
- **Supabase** (Postgres, Auth, Storage)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` → `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Apply schema: run `supabase/migrations/20260528000000_valence_cms.sql` in the SQL editor.
4. Run seed: `supabase/seed.sql`
5. Create Storage bucket `cms-media` (public) for image uploads.
6. Create an Auth user (email/password) in Supabase Dashboard → Authentication.
7. Sign in at `/admin/login` — first login auto-creates an `owner` row in `admin_users`.

Without Supabase, the site uses bundled fallback content from `src/data/fallback-cms.ts`.

## CMS modules (`/admin`)

| Route | Content |
|-------|---------|
| `/admin` | Dashboard + recent submissions |
| `/admin/hero` | Hero copy, imagery, CTAs |
| `/admin/navigation` | Header nav links |
| `/admin/logos` | Trust strip + partner logos |
| `/admin/perspective` | Perspective section |
| `/admin/principles` | Patience / Risk / Alignment |
| `/admin/portfolio` | Selected work projects |
| `/admin/approach` | Investment approach rows |
| `/admin/cta` | Final CTA band |
| `/admin/footer` | Footer statement + wordmark |
| `/admin/submissions` | Form leads |
| `/admin/site` | Site name + admin theme color |

Edits call `refetch()` on the public `CmsProvider` so the homepage updates without redeploy.

## Scripts

- `npm run dev` — development server (port 3000)
- `npm run build` — production build
- `npm run preview` — preview production build

## Agent skills

Supabase agent skills are installed under `.agents/skills/` via:

```bash
npx skills add supabase/agent-skills
```
