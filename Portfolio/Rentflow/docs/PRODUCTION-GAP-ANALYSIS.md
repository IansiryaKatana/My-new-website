# Production gap analysis

Comprehensive backlog to take Rentflow from **demo-capable** to **market-ready** for Dubai rental agencies.

Priorities:
- **P0** — Launch blockers; journey breaks without these
- **P1** — Core workflow completion; matches marketed tenant/company journeys
- **P2** — Professional polish, ops efficiency, trust
- **P3** — Scale, differentiation, integrations

---

## Executive summary

Rentflow has a **strong database foundation** (tables, enums, RLS, RPCs for dashboard and tenant home) and a **usable staff shell** for properties, applications, payments, maintenance, and renewals.

The **tenant journey is ~40% implemented in UI** — discovery, apply, doc upload, and Stripe pay work at a basic level, but viewing confirmation, contracts, proof upload, move-in, renewals, and complaints are missing.

The **company journey is ~55% implemented** — pipeline and payment list exist, but viewings management, missing-docs tracking, contracts, move-in approval, agent assignment, and notifications are missing.

**Biggest risk for production:** tenants and staff complete steps in WhatsApp/email because the app does not close the loop (no notifications, no drill-down, no contract/payment proof flows).

---

## P0 — Launch blockers

### Auth & routing

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| No role-based redirect after login | Tenants land on staff dashboard | After auth, route `tenant` → `/portal`, `owner`/`agent` → `/dashboard` |
| No route guards by role | Tenants can open `/settings`, staff routes | `beforeLoad` on staff routes: `is_staff()`; portal: any authenticated with tenancy/application |
| First signup always gets `tenant` role | Agency owners must run `bootstrap_first_owner` | Clear onboarding UX; or invite-only staff signup |

### Storage infrastructure

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| `tenant-docs` bucket not created in migrations | Document upload may fail in fresh deploy | Migration: `INSERT INTO storage.buckets` for `tenant-docs` |
| `property-images` bucket not created | Property image upload impossible | Same + wire properties UI to upload |

### Payments — offline path

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| No tenant payment proof upload | Cheque/bank tenants stuck on WhatsApp | RPC `submit_payment_proof(payment_id, proof_url)` + portal UI; staff proof review on `/payments` |
| Deposit / agency fee / Ejari not in schedule | Only rent cheques generated | Extend `generate_payment_schedule` or manual payment creation on tenancy |

### Viewings — staff side

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| No `/viewings` staff module | Requests pile up unseen except dashboard snippet | Full inbox: list, filter, confirm time, assign agent, mark completed |
| Action queue not clickable | Staff can't act from dashboard | Link each item to entity (`/viewings?id=`, `/applications/$id`, etc.) |

### Contracts (minimum viable)

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| No contract file attach/send | `contract_sent` is meaningless | Staff upload PDF to storage → set `contract_url` on application/tenancy → tenant download in portal |
| No tenant contract acknowledgment | No audit trail | Tenant "I have read" + optional signed upload |

### Move-in

| Gap | Impact | Suggested fix |
|-----|--------|---------------|
| No `upcoming` → `active` transition | Tenancy never officially starts in system | Staff "Approve move-in" on tenancy; optional tenant confirm keys received |

---

## P1 — Core workflow completion

### Tenant portal expansion

| Feature | Details |
|---------|---------|
| Application detail page | Timeline, status, rejection reason, required docs checklist, withdraw |
| Document center | List uploaded docs + verification status per application |
| Viewing actions | Cancel, confirm proposed time, add notes |
| Payment history | All payments for tenancy, not just upcoming 90 days |
| Renewal offers | Show `offered` renewals; accept/decline via `respondRenewal` |
| Maintenance detail | Thread from `maintenance_updates`; reply when `awaiting_tenant` |
| Complaints module | Create + track (table exists) |
| Profile page | Update phone, Emirates ID, notification preferences |

### Staff — applications & documents

| Feature | Details |
|---------|---------|
| Missing documents matrix | Required types per application; auto flag missing |
| Request documents action | Status note + optional email to tenant |
| `rejection_reason` in UI | On reject from kanban/detail |
| Agent assignment on application | Dropdown of staff agents |
| Application messaging | Use `messages` table for staff ↔ tenant thread |

### Staff — properties

| Feature | Details |
|---------|---------|
| Image upload + gallery | `property_images` rows + `property-images` bucket |
| Property detail view | Viewings + applications per listing |
| Listing analytics UI | Wire `get_listing_analytics` RPC |

### Staff — payments & accounts

| Feature | Details |
|---------|---------|
| Payment filters | Overdue, pending proof, bounced, by property |
| Cheque fields in UI | `cheque_no`, `bank_name`, `reference` |
| Proof review panel | View `proof_url`, approve → `cleared` |
| Payment detail drawer | Full history per tenancy |

### Staff — maintenance & renewals

| Feature | Details |
|---------|---------|
| Ticket detail page | Notes thread, assign `assigned_to`, priority |
| Photo attachments on tickets | Storage bucket + UI |
| Renewal response handling | When tenant accepts, staff confirm + new tenancy draft |
| Expiring tenancies filter | Match dashboard `renewals_due_60d` KPI |

### Staff — tenant 360°

| Feature | Details |
|---------|---------|
| Tenant detail route | Wire `get_tenant_journey` — payments, tickets, renewals, complaints |
| `/tenants/$id` | Replace flat list with drill-down |

---

## P2 — Professional polish & ops

### Notifications (critical for "less WhatsApp")

| Channel | Events |
|---------|--------|
| Email (Resend / SendGrid) | Viewing confirmed, application status change, contract ready, payment due, payment received, maintenance update |
| In-app | `notifications` table + bell icon staff + portal |
| WhatsApp (optional) | Status updates via Business API — high value in UAE market |

No `notifications` table exists today — add one or use Supabase Realtime + `activity_log` writes.

### Team & permissions

| Feature | Details |
|---------|---------|
| Team settings | Invite agents, assign roles, deactivate users |
| Agent-scoped views | My viewings, my applications, my properties |
| Accountant role (optional) | Payments approve-only, no property edit |
| Settings access for agents | Read-only agency info vs owner full access |

### Action queue & activity

| Feature | Details |
|---------|---------|
| Dedicated `/queue` route | Filter by kind, assign, snooze |
| Write `activity_log` | On every status transition |
| Audit trail | Who changed application/payment status and when |

### Branding & public site

| Feature | Details |
|---------|---------|
| Dynamic page titles | Use `agency_name` from branding, not "Rental OS" |
| Public marketing site | Separate from app or expand `/` for SEO |
| Listing search/filters | Community, beds, price range, furnished |

### Mobile UX

| Feature | Details |
|---------|---------|
| Tenant portal mobile-first | Cards, bottom sheets for dialogs (per project rules) |
| Staff tables → cards on mobile | Responsive columns |
| Sidebar mobile nav | Drawer for staff shell on small screens |

### Ejari & UAE compliance

| Feature | Details |
|---------|---------|
| Ejari fields in UI | `ejari_number`, `ejari_status` on tenancy |
| Ejari fee / DEWA deposit payments | In payment schedule |
| Trade license on agency | Already in settings — surface on public footer |

---

## P3 — Scale & differentiation

| Area | Ideas |
|------|-------|
| E-sign | DocuSign / UAE-local provider integration |
| Contract templates | Merge fields from application + property |
| Multi-branch agencies | Branch_id on properties and staff |
| Landlord portal | Owner view of their units |
| Reporting | Occupancy, time-to-lease, agent performance |
| API for public website | Headless listings + apply embed |
| Multi-currency | Already `currency` in settings — enforce everywhere |
| Arabic / RTL | i18n for tenant-facing flows |
| Automated reminders | Cron: overdue payments, expiring leases, missing docs |

---

## Cross-cutting production requirements

### Security

- [ ] Review all `getAgencySettings` / admin reads for data leakage
- [ ] Rate limit public apply/viewing endpoints
- [ ] Virus scan or MIME validation on uploads
- [ ] CSP headers on deploy
- [ ] Stripe webhook idempotency (prevent double `paid`)

### Reliability

- [ ] Error monitoring (Sentry)
- [ ] Webhook failure retry / dead letter
- [ ] Database backups verified
- [ ] Seed script vs production data separation

### Testing

- [ ] E2E: tenant apply → staff approve → tenancy → pay
- [ ] Stripe test mode CI flow
- [ ] RLS policy tests per role

### DevOps

- [ ] Document duplicate-deploy checklist (Supabase project + Settings → Stripe + branding)
- [ ] `APP_URL` / webhook URL per environment
- [ ] Staging environment

### Legal / product

- [ ] Privacy policy, terms of service pages
- [ ] Tenant consent on document upload
- [ ] PDPL (UAE) data retention policy

---

## Recommended build order (12-week sketch)

### Weeks 1–2 — Unblock journeys
1. Role-based auth routing
2. Storage bucket migrations
3. Staff `/viewings` module
4. Clickable action queue

### Weeks 3–4 — Tenant portal depth
5. Application detail + doc checklist
6. Payment proof upload + staff review
7. Contract upload + tenant download

### Weeks 5–6 — Close the lease loop
8. Move-in approval
9. Renewal UI (tenant + staff)
10. Maintenance ticket detail + updates

### Weeks 7–8 — Comms
11. Email notifications (top 5 events)
12. In-app notification center

### Weeks 9–10 — Staff efficiency
13. Tenant 360° / journey page
14. Missing docs matrix
15. Property image upload
16. Agent assignment

### Weeks 11–12 — Production hardening
17. Complaints module
18. Team invite / roles UI
19. E2E tests + monitoring
20. Mobile pass on portal + dialogs

---

## What is already production-quality

- Supabase schema design for full rental lifecycle
- RLS policies for tenant isolation
- Staff shell layout, branding system (colors, dual logos, favicon)
- Stripe Connect + Checkout + webhook (DB-stored credentials)
- Application kanban pipeline
- Document verify flow (staff)
- Dashboard KPIs and funnel
- Demo seed script with realistic UAE data
- Payment schedule generation for cheques

---

## Related docs

- [WORKFLOWS.md](./WORKFLOWS.md) — journey maps with ✅/🟡/❌
- [ARCHITECTURE-SNAPSHOT.md](./ARCHITECTURE-SNAPSHOT.md) — routes, tables, RPCs today
