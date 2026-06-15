# NGUNJUK Matcha — TanStack Start + Supabase CMS

Mobile-first editorial matcha eCommerce landing page with a full embedded admin CMS at `/admin`.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start (React 19, TypeScript, Vite 8) |
| Styling | Tailwind CSS v4 + shadcn/Radix-style UI |
| Animation | GSAP + ScrollTrigger |
| Backend | Supabase (Postgres, Auth, Storage) |
| Rich text (admin) | TipTap |

## Quick start

```bash
npm install
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

Without Supabase env vars, the site runs in **static fallback mode** using `src/data/cms-fallback.json`.

## Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy URL + anon key into `.env`.
3. Apply the schema:

```bash
supabase link --project-ref YOUR_REF
supabase db push
```

Or run `supabase/migrations/20260529000000_ngunjuk_cms.sql` in the SQL editor.

4. Create your first admin user:
   - Sign up via **Authentication** in Supabase dashboard (email/password).
   - Insert a row in `admin_users` linking `auth_user_id` and `email` with role `owner`.

5. Enable email auth and create the `cms-media` public storage bucket (migration attempts this automatically on local Supabase).

## CMS modules (`/admin`)

| Route | Manages |
| --- | --- |
| `/admin` | Dashboard counts + recent submissions |
| `/admin/products` | Product catalog (ceremonial, seasonal, signature) |
| `/admin/benefits` | Hero curved marquee labels |
| `/admin/nav` | Footer / mobile navigation links |
| `/admin/sections` | Hero, Essence, Promo, Flavor, Footer JSON sections |
| `/admin/submissions` | Newsletter & form inbox |
| `/admin/media` | Asset library (`cms-media` bucket) |
| `/admin/site` | Brand colors & site settings |
| `/admin/users` | Admin RBAC (owner/admin only) |

After any write that affects the public site, the admin calls `refetchCms()` so the landing page updates without redeploy.

## Public routes

| Path | Page |
| --- | --- |
| `/` | Full NGUNJUK landing (hero → marquee → essence → promo → flavor → footer) |
| `/menu` | Product grid from CMS |
| `/signature` | Signature category products |
| `/locations` | Locations placeholder |
| `/contact` | Contact placeholder |

## Dynamic CMS fields (landing)

Editable from admin:

- **Hero** — headline, subheadline, background image, CTA, badge, micro-card
- **Benefits** — curved marquee strip text
- **Essence** — headings, powder image, captions
- **Promo** — split card copy, images, secondary marquee words
- **Flavor** — showcase drink, fruit cards, labels, CTA
- **Footer** — nav links, newsletter copy, wordmark
- **Products** — all Order Now targets and menu pages
- **Site settings** — brand name, colors, tagline

## Scripts

```bash
npm run dev      # Dev server on port 3000
npm run build    # Production build
npm run preview  # Preview production build
npm run test     # Vitest
```

## Agent skills

Supabase agent skills are installed under `.agents/skills/` via:

```bash
npx skills add supabase/agent-skills
```

## Reference

- UI/UX spec: `UIUX Concept Breakdown — NGUNJUK Ma.txt`
- CMS blueprint: `Master blueprint CMS admin dashboar.txt`
