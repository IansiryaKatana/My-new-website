# Architecture snapshot (current codebase)

_Last aligned with migrations through `20260608160000`._

## Stack

- **Frontend:** TanStack Start + React + Vite + Tailwind
- **Backend:** `createServerFn` handlers (no separate API layer)
- **Database:** Supabase Postgres + RLS + RPCs
- **Storage:** Supabase Storage buckets
- **Payments:** Stripe Connect + Checkout (credentials in `agency_settings`)
- **Deploy target:** Cloudflare Workers (Nitro preset)

## Routes

### Public

| Path | File |
|------|------|
| `/` | `src/routes/index.tsx` |
| `/listings` | `src/routes/listings.tsx` |
| `/listings/$id` | `src/routes/listings.$id.tsx` |
| `/auth` | `src/routes/auth.tsx` |
| `/forgot-password` | `src/routes/forgot-password.tsx` |
| `/reset-password` | `src/routes/reset-password.tsx` |

### Authenticated (staff + tenant share `/_authenticated`)

| Path | File | Primary audience |
|------|------|------------------|
| `/dashboard` | `_authenticated/dashboard.tsx` | Staff |
| `/properties` | `_authenticated/properties.tsx` | Staff |
| `/applications` | `_authenticated/applications.tsx` | Staff |
| `/applications/$id` | `_authenticated/applications.$id.tsx` | Staff |
| `/tenants` | `_authenticated/tenants.tsx` | Staff |
| `/payments` | `_authenticated/payments.tsx` | Staff |
| `/maintenance` | `_authenticated/maintenance.tsx` | Staff |
| `/renewals` | `_authenticated/renewals.tsx` | Staff |
| `/settings` | `_authenticated/settings.tsx` | Owner |
| `/portal` | `_authenticated/portal.tsx` | Tenant |

### API

| Path | Handler |
|------|---------|
| `POST /api/stripe/webhook` | `src/lib/stripe-webhook.server.ts` via `src/server.ts` |

## Server function modules

| Module | Key functions |
|--------|----------------|
| `agency.functions.ts` | Settings, branding |
| `applications.functions.ts` | Submit, list, verify docs, status |
| `auth.functions.ts` | Current user, bootstrap owner |
| `dashboard.functions.ts` | Overview, funnel, action queue |
| `maintenance.functions.ts` | Tickets CRUD |
| `payments.functions.ts` | List, update, Stripe checkout |
| `properties.functions.ts` | CRUD, public listing |
| `renewals.functions.ts` | Offer, respond, list |
| `stripe.functions.ts` | Connect, credentials, public config |
| `tenancies.functions.ts` | Create, update, journey RPC |
| `tenant.functions.ts` | `getTenantHome` |
| `viewings.functions.ts` | Request, list, update |

## Database tables

| Table | Used in UI |
|-------|------------|
| `profiles` | Partial (embedded in applications) |
| `user_roles` | Auth only |
| `agency_settings` | Settings |
| `properties` | Yes |
| `property_images` | No |
| `viewings` | Tenant create + portal read only |
| `applications` | Yes |
| `application_documents` | Yes (staff verify; tenant upload) |
| `tenancies` | Partial (create on approve) |
| `payments` | Yes |
| `maintenance_tickets` | Yes |
| `maintenance_updates` | No |
| `renewals` | Staff offer only |
| `complaints` | No |
| `messages` | No |
| `activity_log` | No |

## RPCs

| RPC | Used in UI |
|-----|------------|
| `get_dashboard_overview` | Yes |
| `get_rental_funnel` | Yes |
| `get_action_queue` | Yes (display only) |
| `get_payment_summary` | Yes |
| `get_listing_analytics` | No |
| `get_tenant_home` | Yes (portal) |
| `get_tenant_journey` | No |
| `generate_payment_schedule` | Yes (on tenancy create) |
| `bootstrap_first_owner` | Auth signup |

## Storage buckets

| Bucket | Migration creates bucket? | Policies |
|--------|----------------------------|----------|
| `branding` | Yes | Public read; staff write |
| `tenant-docs` | **No** (policies only) | Tenant prefix + staff |
| `property-images` | **No** (policies only) | Staff write |

## Roles & security

- Roles: `owner`, `agent`, `tenant`
- `is_staff()` = owner OR agent
- `_authenticated` route: login check only — **no role guard**
- Agency settings / Stripe: owner-only RLS
- Stripe secrets: stored in DB; masked in API responses
