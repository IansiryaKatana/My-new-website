# CMS-dynamic content map (Marden Energy)

Everything below is editable in `/admin` when Supabase is configured, with static JSON fallback in `src/data/cms-fallback.json`.

| Public section | Admin route | Table(s) | Dynamic fields |
|----------------|-------------|----------|----------------|
| Header / nav | `/admin/navigation` | `navigation_links` | label, href, sort_order, is_cta, published |
| Hero | `/admin/hero` | `hero_content` | headlines, subcopy, CTA, background + thumbnail images |
| Hero stats card | `/admin/metrics` | `metrics` | value, label, featured flag, order |
| Projects intro | Site / section_copy | `section_copy` (`projects`) | eyebrow, heading, body |
| Project grid | `/admin/projects` | `projects` | title, slug, description, images, category, layout, CTA, published |
| Capabilities | DB + services | `capabilities_section`, `services` | copy, background image, service tags, active state |
| Process | `/admin/process` | `process_stages`, `section_copy` (`process`) | accordion rows, section copy, image |
| Global map | `/admin/map` | `map_section`, `map_locations` | headline, CTA, marker positions & status |
| Footer | `/admin/footer`, social | `footer_columns`, `social_links` | columns (JSON links), social URLs |
| Branding | `/admin/site` | `site_settings` | brand_name, admin theme colors |
| Leads | `/admin/submissions` | `form_submissions` | inbound messages (read/delete) |
| Access | `/admin/users` | `admin_users` | roles: owner, admin, editor, viewer |

After any write that affects the public site, admin modules call `refetch()` on `CmsContext` so the homepage updates without redeploy.
