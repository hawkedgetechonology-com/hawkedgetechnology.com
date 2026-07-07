# API Reference — HawkEdge Version 1.0

The REST API gateway exposes OpenAPI Swagger documentation at `http://localhost:5000/api/docs` (development) or `https://api.hawkedge.tech/api/docs` (production).

---

## 📡 Core Endpoint Registry

### 1. Telemetry and System Diagnostics (Neutral Routing)
- **`GET /health`**: Light check returning server status.
- **`GET /live`**: Operational metrics probe. Returns memory statistics and process uptime.
- **`GET /ready`**: Active connection latency test for PostgreSQL and Redis. Returns `200 OK` or `503 Service Unavailable`.

### 2. Authentication Portal (`/api/v1/auth`)
- **`POST /auth/register`**: Registers a student account.
- **`POST /auth/login`**: Validates credentials. Returns `accessToken` (15 min) and `refreshToken` (7 days).
- **`POST /auth/refresh`**: Generates a new access token using a valid refresh token.
- **`POST /auth/logout`**: Revokes active session.
- **`POST /auth/mfa/enable`**: Sets up TOTP secret keys and recovery codes.

### 3. Proposals and CRM (`/api/v1/proposals`)
- **`POST /proposals`**: Admin builds a draft contract.
- **`GET /proposals/:id`**: Fetch proposal details.
- **`PATCH /proposals/:id/status`**: Updates proposal state. Set status to `ACCEPTED` to trigger the automated project onboarding pipeline.
