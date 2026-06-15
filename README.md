# Ian Sirya — Developer Portfolio

TanStack Start + React 19 + TypeScript + Vite portfolio with an editorial hero and full multi-page site structure.

## Pages

- `/` — Home (hero, featured work, capabilities, experience, stack, about preview, contact CTA)
- `/projects` — Project index
- `/projects/:slug` — Case study detail
- `/about` — Bio and approach
- `/experience` — Work timeline
- `/contact` — Validated inquiry form (mailto handoff)

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

## SEO

- Per-route meta tags and canonical URLs via `src/lib/seo.ts`
- JSON-LD structured data (Person, WebSite, Breadcrumbs, CreativeWork)
- `public/robots.txt` and `public/sitemap.xml`

Production site: [https://iankatana.com](https://iankatana.com) · Contact: Hello@iankatana.com

## Assets

Replace the portrait at `hero.png` (referenced from `src/data/hero-content.ts`).
