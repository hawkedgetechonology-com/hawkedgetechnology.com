# Handover Documentation — HawkEdge Version 1.0

Welcome to the HawkEdge codebase. This document outlines coding standards, branching strategies, and database guides for future developers.

---

## 💻 Coding Standards & Linting

We enforce strict type safety and code formatting:
- **TypeScript**: Set `strict: true` inside all `tsconfig.json` configurations. Any code changes must compile without errors.
- **ESLint & Prettier**: Checked via `pnpm lint`. Unused variables are blocked.
- **Environment Variables Validation**: Any new config settings must be defined inside `@hawkedge/shared/src/env.ts`.

---

## 🎋 Branch Strategy & Release Management

We follow standard **Git Flow** conventions:
- **`main` branch**: Production-ready release branch. Any commits to `main` are tagged as stable versions (e.g. `v1.0.0`).
- **`develop` branch**: Integration branch for new feature sprints.
- **`feature/` branches**: Cut from `develop` and merged back via reviewed Pull Requests.
- **Version Tagging**: Releases must follow semantic versioning rules (`vMAJOR.MINOR.PATCH`).

---

## 💾 Database Migrations & Administration

The database uses PostgreSQL managed via Prisma:
- **Local Dev Syncing**: Run `pnpm --filter @hawkedge/database db:push` to sync database schemas locally without generating migration histories.
- **Production Migrations**: Create schema migration SQL files using:
  ```bash
  pnpm --filter @hawkedge/database exec prisma migrate dev --name your_migration_name
  ```
  On the production server, deploy migration files using:
  ```bash
  pnpm --filter @hawkedge/database exec prisma migrate deploy
  ```

---

## 🛠️ Staging Verification Flow

To verify a release candidate locally:
1. Spin up the staging stack: `docker-compose -f docker-compose.prod.yml up -d --build`
2. Run database schema sync: `docker-compose -f docker-compose.prod.yml exec api pnpm --filter @hawkedge/database db:push`
3. Run the automated integration checks: `npx ts-node scripts/test-e2e.ts`
4. Confirm test completion logs return status `0`.
