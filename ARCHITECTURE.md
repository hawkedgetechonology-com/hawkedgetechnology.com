# Architecture Documentation — HawkEdge Version 1.0

This document defines the architectural patterns, data flow, container layers, and structural standards of the HawkEdge monorepo.

---

## 🏗️ Monorepo Framework

HawkEdge is constructed as a **Turborepo monorepo** managed via **pnpm**:

- **Build Orchestration**: `turbo.json` defines task dependencies. Environment settings are isolated inside a shared `globalEnv` list to protect cache checks.
- **Packages Layer**: Shared utilities are decoupled into `@hawkedge/` namespaces:
  - `@hawkedge/shared`: Global environment variable schemas, Zod validation engines, and error boundaries.
  - `@hawkedge/auth`: Jose JWT encryption logic, RBAC policies, and decorators.
  - `@hawkedge/database`: Centralized Prisma client context wrapper.
  - `@hawkedge/ui`: Shared editorial components.
  - `@hawkedge/config`: Global CSS variables and tailwind presets.

---

## 💾 Data Flow & Cache Strategy

```
  Next.js Apps ──> [ Nginx Edge Proxy ] ──> NestJS API Gateway
                                                 │
                             ┌───────────────────┴───────────────────┐
                             ▼                                       ▼
                     [ PostgreSQL DB ]                       [ Redis Cache ]
                   (Parametrizations SQL)               (Session Revocations)
```

- **PostgreSQL**: Used for transactions, CRM records, proposals, projects, support tickets, and audit logs. Database schema indexes are added to speed up lookups.
- **Redis**: Caches active session IDs (`session:${id}:active`) to fast-track JWT authorization checks without querying the primary database.
- **Nginx Edge**: Compresses responses via Gzip, limits connections, and caches static Next.js assets (`/_next/static/*`) in the browser.
- **Node Isolation**: Containers run under the unprivileged `node` user context for security containment.
