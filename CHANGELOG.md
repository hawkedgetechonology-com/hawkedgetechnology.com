# Changelog

All notable changes to the **HawkEdge Monorepo Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-08

### Added
- **Startup Environment Validation**: Integrated strict Zod schema checking in NestJS and Next.js startup hooks (`main.ts` and `next.config.js` loader gates).
- **Proactive Database Indexing**: Added relation columns indexes (`@@index`) for critical join columns in `schema.prisma` mapping projects, milestones, meetings, support requests, and proposals.
- **Service Monitoring API**: Exposes neutral `/health`, `/live` (telemetry CPU/RAM specs), and `/ready` (Database and Redis connection and latency diagnostic) endpoints.
- **Graceful Shutdown**: Docker containers configured with direct `node` process executions to receive SIGTERM signals.
- **Disaster Recovery Utilities**: Added backup decryption and restoration script (`scripts/db-restore.sh`).
- **E2E Integration Test**: Added a 13-stage business flow verification script (`scripts/test-e2e.ts`) executing visitor form registration, meeting bookings, client invitation routing, and ticket submissions.

### Changed
- **Proxy Networking**: Upgraded `nginx/default.conf` config headers, enabling payload limits (`10M`/`15M`), static asset caching controls, and edge connection rate-limiting (`10r/s`).
- **Docker Compose Configurations**: Aligned environment mappings, network bridges, and dependencies controls in development (`docker-compose.yml`) and production (`docker-compose.prod.yml`).

### Security
- Secure non-root runner contexts (`USER node` isolation) added across all services Alpine images.
- Verified zero production dependencies security vulnerabilities.
