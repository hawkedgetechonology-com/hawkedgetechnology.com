#!/bin/bash
# HawkEdge Database Backup Automation Script
# Usage: ./db-backup.sh [backup_dir]

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
DB_NAME="${POSTGRES_DB:-hawkedge_production}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"
ENCRYPTED_FILE="${COMPRESSED_FILE}.enc"

# Encryption key placeholder (in production, fetch from vault or environment)
BACKUP_PASSWORD="${BACKUP_PASSWORD:-hawkedge_backup_key_2026}"

echo "===================================================="
echo "HawkEdge Database Backup Initiated: $(date)"
echo "Target DB: ${DB_NAME} on ${DB_HOST}:${DB_PORT}"
echo "===================================================="

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# 1. Run pg_dump
echo "// Extracting database schema and data..."
PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" pg_dump -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -F p -f "${BACKUP_FILE}"

# 2. Compress the backup SQL file
echo "// Compressing sql backup archive..."
gzip -f "${BACKUP_FILE}"

# 3. Encrypt the backup using OpenSSL AES-256
echo "// Encrypting compressed archive..."
openssl enc -aes-256-cbc -salt -pbkdf2 -in "${COMPRESSED_FILE}" -out "${ENCRYPTED_FILE}" -k "${BACKUP_PASSWORD}"

# Clean intermediate compressed file
rm -f "${COMPRESSED_FILE}"

echo "===================================================="
echo "Backup Completed Successfully!"
echo "Encrypted Archive: ${ENCRYPTED_FILE}"
echo "===================================================="

# 4. Enforce Retention Policy: Prune backups older than 30 days
echo "// Applying retention policy: pruning archives older than 30 days..."
find "${BACKUP_DIR}" -type f -name "*_backup_*.sql.gz.enc" -mtime +30 -exec rm -f {} \;
echo "// Pruning complete."
echo "===================================================="
