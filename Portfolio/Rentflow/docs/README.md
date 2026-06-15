# Rentflow documentation

Rentflow is a Dubai-focused rental agency operating system: one platform for the tenant journey (discover → view → apply → pay → live) and the company journey (list → assign → review → contract → collect → manage).

## Documents

| Document | Purpose |
|----------|---------|
| [WORKFLOWS.md](./WORKFLOWS.md) | Ideal tenant & company journeys mapped to current implementation |
| [PRODUCTION-GAP-ANALYSIS.md](./PRODUCTION-GAP-ANALYSIS.md) | Full gap list, priorities, and recommended build order |
| [ARCHITECTURE-SNAPSHOT.md](./ARCHITECTURE-SNAPSHOT.md) | What exists today — routes, tables, RPCs, storage |

## Market positioning

**Tenant benefit:** fewer office visits, less WhatsApp back-and-forth, clear status updates, easier documents and payments.

**Company benefit:** fewer manual follow-ups, better pipeline tracking, faster rentals, professional tenant experience, payments and documents in one place.

## Current maturity (summary)

| Area | Maturity |
|------|----------|
| Database schema & RLS | **Strong** — most lifecycle tables exist |
| Staff dashboard & core modules | **Moderate** — properties, applications, payments, maintenance, renewals |
| Tenant portal | **Early** — shallow summaries; several flows missing |
| End-to-end journey completion | **Low** — many steps stop at schema or server-only |
| Notifications & comms | **Missing** |
| Contracts & move-in | **Missing** |
| Production ops (email, monitoring, tests) | **Minimal** |

See [PRODUCTION-GAP-ANALYSIS.md](./PRODUCTION-GAP-ANALYSIS.md) for the prioritized backlog.
