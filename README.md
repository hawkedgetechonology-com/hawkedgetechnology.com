# HawkEdge Technology Monorepo Platform

This is the production-grade monorepo codebase for **HawkEdge Technology**, structured for absolute performance, strict type-safety, and database-driven RBAC governance.

---

## 🏗️ MONOREPO WORKSPACE HIERARCHY

```
hawkedge/
├── apps/
│   ├── web/              # Frontier Basecamp (Public-facing Next.js 15 app)
│   ├── platform/         # Logged-in Workspace Cockpit (Partner/Explorer portal)
│   └── admin/            # Mission Control Hub (Administrative portal)
│
├── packages/
│   ├── ui/               # Reusable Precision Editorial design components
│   ├── auth/             # Jose tokens signatures, rank verifiers
│   ├── database/         # Prisma client client configuration & schema
│   ├── shared/           # Zod schema checks, validation helpers
│   ├── config/           # Centralized Tailwind presets, global CSS variables
│   └── types/            # Workspace types declarations & rank badges
│
├── services/
│   ├── api/              # Rest API controller engine (NestJS)
│   ├── notifications/    # (P2 Reserved workspace) Live signals dispatcher
│   ├── storage/          # (P2 Reserved workspace) Ingestion engine
│   └── email/            # (P2 Reserved workspace) Message dispatchers
│
├── docker-compose.yml    # Development PostgreSQL & Redis services
└── turbo.json            # TurboRepo pipeline dependency map
```

---

## 🛠️ TOOLINGS & STACK SPECIFICATION

| Domain | Technology | Configuration Path |
|---|---|---|
| **Build System** | TurboRepo | `/turbo.json` |
| **Package Manager**| pnpm | `/pnpm-workspace.yaml` |
| **Types Checking** | TypeScript | `/tsconfig.json` |
| **Styling** | Tailwind CSS | `/packages/config/src/index.ts` |
| **Linter** | ESLint | `/.eslintrc.json` |
| **Formatter** | Prettier | `/.prettierrc` |
| **Database ORM** | Prisma | `/packages/database/prisma/schema.prisma` |

---

## 🚀 INSTALLATION & LOCAL KICKOFF

### 1. Prerequisites
- Node.js version `>= 18.0.0`
- pnpm package manager installed globally:
  ```bash
  npm install -g pnpm
  ```
- Docker Desktop installed and active.

### 2. Clean Installation
From the root workspace directory, install dependencies:
```bash
pnpm install
```

### 3. Spin Up Infrastructure
Launch the local PostgreSQL database and Redis caching engines:
```bash
docker-compose up -d
```

### 4. Database Setup & Client Compilation
Initialize database columns and generate the Prisma Client bindings:
```bash
pnpm db:generate
pnpm db:push
```

### 5. Running in Development Mode
Launch all apps (web, platform, admin, services api) concurrently via TurboRepo:
```bash
pnpm dev
```
Local Port Mappings:
- **Public Website (`web`):** `http://localhost:3000`
- **Client/Explorer Platform (`platform`):** `http://localhost:3001`
- **Admin Mission Control (`admin`):** `http://localhost:3002`
- **NestJS REST API Gateway (`api`):** `http://localhost:5000/api`
- **OpenAPI Swagger Page:** `http://localhost:5000/api/docs`

---

## 💻 DEVELOPMENT WORKFLOW & PIPELINE STANDARDS

### Running Checks
Before committing code modifications, local validation checks must run and pass:
```bash
# Type check all workspaces
pnpm build

# Run linting checks
pnpm lint

# Format code files
pnpm format
```

### Code Guidelines
- **Strict Types:** `any` type definitions are strictly prohibited. Always export interfaces from `@hawkedge/types` or `@hawkedge/shared`.
- **Atomic Components:** UI features must reside inside `@hawkedge/ui` using tailwind tokens variables and Framer Motion easing configurations.
- **Transactional DB operations:** Database modifications must execute via service operations. Direct connections outside client instances are restricted.

---

**Version**: 1.0  
**Status**: Implementation Phase  
**Owner**: Lead Software Engineer, HawkEdge Technology
