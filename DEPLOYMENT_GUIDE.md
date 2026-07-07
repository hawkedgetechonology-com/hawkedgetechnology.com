# Deployment Guide — HawkEdge Version 1.0

This guide details the step-by-step instructions for compiling, deploying, and verifying the production-grade HawkEdge stack.

---

## 🚀 Pre-Deployment Requirements

- **Server Architecture**: Linux machine (Ubuntu 22.04 LTS recommended) with minimum 2 CPU Cores, 4GB RAM.
- **Dependencies**:
  - Docker Engine v24.0.0+
  - Docker Compose v2.20.0+
  - OpenSSL (for backup decryption keys generation)

---

## ⚙️ Step 1: Environment Variables Configuration

1. Copy the production environment example template to active `.env`:
   ```bash
   cp .env.production.example .env
   ```
2. Open `.env` and fill the variables:
   - Generate secure random JWT keys:
     ```bash
     openssl rand -base64 32
     ```
   - Input production PostgreSQL (`DATABASE_URL`) and Redis (`REDIS_URL`) credentials.
   - Configure SMTP credentials and CORS allowed origins mapping.

---

## 🔒 Step 2: Nginx SSL/TLS Certificate Setup

Nginx expects active TLS certificates under the `./nginx/certs` volume:
1. Obtain real domain certificates (e.g. via Let's Encrypt).
2. Save your certificates in the folder `./nginx/certs/`:
   ```bash
   mkdir -p nginx/certs
   mv /path/to/fullchain.pem nginx/certs/hawkedge.crt
   mv /path/to/privkey.pem nginx/certs/hawkedge.key
   ```

---

## 🚀 Step 3: Spin Up Staging & Production Clusters

1. Build and boot the stack in detached mode:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
2. Verify all container services are up and healthy:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```
3. Push database schema parameters and seed the initial credentials:
   ```bash
   docker-compose -f docker-compose.prod.yml exec api pnpm --filter @hawkedge/database db:push
   ```
4. Query the telemetry endpoints to confirm:
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:5000/ready
   curl http://localhost:5000/live
   ```
