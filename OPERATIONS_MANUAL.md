# Operations Manual — HawkEdge Version 1.0

This manual documents operational guidelines, diagnostic checkpoints, backup scheduling, and recovery automation instructions.

---

## 🖥️ Container Management Commands

- **Monitor Container Resource Consumption**:
  ```bash
  docker stats
  ```
- **Inspect Live Logs**:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f --tail=100
  ```
- **Restart Specific Service (Hot Deploy)**:
  ```bash
  docker-compose -f docker-compose.prod.yml restart api
  ```

---

## 📊 Telemetry Diagnostic Monitoring

Health and connectivity verification endpoints:
- **Liveness Probe** (`/live`): Analyzes CPU usage, process uptime, and RAM consumption.
- **Readiness Probe** (`/ready`): Queries PostgreSQL and Redis connection latency metrics. Returns HTTP `200 OK` or HTTP `503 Service Unavailable`.
- **System Health** (`/health`): Confirms simple application metadata matches current deploy version.

---

## 💾 System Backups & Disaster Recovery

### Database Backup
- Script location: `scripts/db-backup.sh`
- Action: Runs `pg_dump`, compresses using gzip, encrypts using openssl (AES-256-CBC), and applies a 30-day retention pruning policy.
- Cron Setup (Daily at Midnight):
  ```cron
  0 0 * * * /path/to/hawkedge/scripts/db-backup.sh /var/backups/hawkedge >> /var/log/hawkedge-backup.log 2>&1
  ```

### Database Recovery
- Script location: `scripts/db-restore.sh`
- Action: Decrypts backup SQL archive and restores database schema and tables.
- Run Command:
  ```bash
  export POSTGRES_PASSWORD="your_postgres_password"
  export BACKUP_PASSWORD="your_secure_decryption_password"
  ./scripts/db-restore.sh ./backups/hawkedge_production_backup_20260707_230000.sql.gz.enc
  ```
