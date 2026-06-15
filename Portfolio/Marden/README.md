# Marden Energy - TanStack Start + Supabase CMS

Premium renewable infrastructure marketing site with an embedded admin CMS at `/admin`.

## Stack

- **React 19** + **TypeScript**
- **TanStack Start** (Vite 8, file-based routing)
- **Tailwind CSS v4**
- **Radix UI** + shadcn-style primitives
- **Supabase** (Postgres, Auth, Storage-ready)
- **GSAP** for cinematic motion

## Quick start

```bash
npm install
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

Without Supabase env vars, the site runs in **static mode** using `src/data/cms-fallback.json`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260528000000_verden_cms.sql` in the SQL editor.
3. Enable Email auth; create your first user in Authentication.
4. Sign in at `/admin/login` - first login auto-creates an `owner` row in `admin_users`.
5. (Optional) Create Storage bucket `cms-media` for asset uploads.

See [docs/cms-dynamic-fields.md](docs/cms-dynamic-fields.md) for the full content model.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Project structure

```
src/
  components/site/     # Marden public sections
  components/ui/       # shadcn-style primitives
  admin/               # CMS shell + CRUD modules
  contexts/            # CmsProvider, AdminAuthProvider
  lib/cms/             # Snapshot loader + types
  integrations/supabase/
  routes/              # TanStack file routes
supabase/migrations/   # Postgres schema + RLS
```

## Agent skills

Supabase agent skills are installed under `.agents/skills/` via:

```bash
npx skills add supabase/agent-skills
```
