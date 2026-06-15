# Workflow maps — ideal vs implemented

Legend: ✅ Done · 🟡 Partial · ❌ Missing

---

## Tenant journey

```
Find property online
        ↓
Request viewing
        ↓
Agent confirms viewing
        ↓
Tenant views property
        ↓
Apply online
        ↓
Upload Emirates ID, passport, visa, etc.
        ↓
Track application / document status
        ↓
Receive contract & payment terms
        ↓
Sign or upload signed contract
        ↓
Pay online OR upload payment proof
        ↓
Accounts confirms payment
        ↓
Move-in approved
        ↓
Maintenance / renewal / requests from portal
```

### Step-by-step status

| Step | Status | What exists | What's missing |
|------|--------|-------------|----------------|
| Find property online | ✅ | `/listings`, `/listings/$id`, public property RPC | SEO, filters, map search, saved listings |
| Request viewing | ✅ | `requestViewing` from listing detail | Preferred slots only; no cancel/reschedule UI |
| Agent confirms viewing | ❌ | DB: `viewings.status`, `scheduled_at`, `agent_id` | Staff viewings UI; tenant confirmation of proposed time |
| Tenant views property | 🟡 | Portal lists viewings (read-only) | No directions, agent contact, feedback after visit |
| Apply online | ✅ | `submitApplication` from listing | No apply-without-account guest flow |
| Upload documents | 🟡 | Portal upload per application; `tenant-docs` policies | No doc list/status for tenant; bucket not in migrations; no upload during apply |
| Track application status | 🟡 | Portal shows status badge | No detail page, timeline, rejection reason, withdraw |
| Receive contract & terms | ❌ | Status `contract_sent` exists | No contract file, no notification, no terms view |
| Sign / upload contract | ❌ | `tenancies.contract_url` column | Entire flow — upload, e-sign, download |
| Pay online | 🟡 | Stripe Checkout from portal | Requires owner Stripe setup; no deposit/fee schedule visibility |
| Upload payment proof | ❌ | `payments.proof_url` column | No tenant UI; RLS blocks tenant payment UPDATE |
| Accounts confirms payment | 🟡 | Staff changes status on `/payments` | No proof review UI; no accounts queue |
| Move-in approved | ❌ | Tenancy `upcoming` → `active` in schema | No approval UI for staff or tenant |
| Maintenance from portal | 🟡 | Create ticket + list open | No detail, thread, photos, history |
| Renewal from portal | ❌ | `respondRenewal` server fn | Not in portal; `get_tenant_home` omits renewals |
| Complaints / messages | ❌ | `complaints`, `messages` tables | No UI or server functions |

### Tenant portal gaps (UX)

- Login sends **everyone** to `/dashboard` — tenants must find `/portal` manually
- No role-based home route
- No tenant profile / settings page
- No notifications or status change alerts
- Portal sections are **read-only cards** — no drill-down pages

---

## Company journey

```
Upload available properties
        ↓
Receive viewing requests
        ↓
Assign agents to viewings
        ↓
Track who viewed what
        ↓
Convert to applications
        ↓
Review documents
        ↓
Track missing documents
        ↓
Share contract & payment terms
        ↓
Confirm payments (accounts)
        ↓
Approve move-in
        ↓
Manage tenants post move-in
        ↓
Maintenance, renewals, complaints, payments, documents
```

### Step-by-step status

| Step | Status | What exists | What's missing |
|------|--------|-------------|----------------|
| Upload properties | 🟡 | `/properties` CRUD | Image upload to storage; gallery; amenities; analytics UI |
| Viewing requests | 🟡 | Dashboard action queue snippet | **No `/viewings` module**; confirm/schedule/assign UI |
| Assign agents | ❌ | `agent_id` on viewings/applications | Agent picker, team page, workload views |
| Track viewings per property | 🟡 | Data in DB | No staff report or property detail view |
| Applications pipeline | ✅ | Kanban + detail `/applications/$id` | Missing-docs checklist; agent assign; messaging |
| Document review | 🟡 | Verify toggle + signed URL open | Inline preview; per-doc reject notes; required doc matrix |
| Missing documents | ❌ | — | Required doc config; auto flag; request-docs action |
| Contract & payment terms | ❌ | `contract_sent` status | PDF generate/upload; send to tenant; payment schedule share |
| Confirm payments | 🟡 | `/payments` status dropdown | Proof review; cheque fields; filters; accounts role |
| Approve move-in | ❌ | `updateTenancy` server fn | Move-in checklist; `upcoming` → `active` UI |
| Post move-in management | 🟡 | Tenants list, maintenance, renewals, payments | Complaints; tenant journey page; messaging |
| Dashboard action queue | 🟡 | `get_action_queue` on dashboard | Items not clickable; no dedicated queue route |
| Notifications | ❌ | — | Email, SMS, WhatsApp, in-app |

### Staff navigation today

| Route | Purpose |
|-------|---------|
| `/dashboard` | KPIs, funnel, action queue |
| `/properties` | Property CRUD |
| `/applications` | Pipeline + detail |
| `/tenants` | Tenancy list |
| `/payments` | Payment list |
| `/maintenance` | Ticket list |
| `/renewals` | Offer renewals |
| `/settings` | Agency, branding, Stripe |

**Not routed:** viewings, complaints, contracts, move-in, team/agents, notifications, tenant 360° view.

---

## Application status machine (intended)

```
submitted → docs_review → contract_sent → approved → (create tenancy)
                ↓              ↓
            rejected      withdrawn (tenant)
```

**Gaps:** `contract_sent` does not attach a contract. `approved` → tenancy creation exists but no contract step in between. No automated emails at transitions.

---

## Tenancy lifecycle (intended)

```
(upcoming) → active → notice_given → ended / terminated
```

**Gaps:** Nothing in UI moves `upcoming` → `active`. Renewals don't spawn new tenancy on accept. Ejari fields unused in UI.

---

## Payment lifecycle (intended)

```
scheduled → pending → cleared/paid  (or bounced)
         ↘ Stripe checkout → webhook → paid
         ↘ proof upload → staff review → cleared
```

**Gaps:** Only rent cheques auto-generated. Deposit/agency fee/Ejari payments not auto-created. Proof upload path missing for tenants.
