#!/bin/bash
# HawkEdge Database Restore Automation Script
# Usage: ./db-restore.sh <encrypted_backup_file_path>

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Error: Encrypted backup archive path is required."
  echo "Usage: $0 <path_to_encrypted_file.sql.gz.enc>"
  exit 1
fi

ENCRYPTED_FILE="$1"
DB_NAME="${POSTGRES_DB:-hawkedge_production}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
BACKUP_PASSWORD="${BACKUP_PASSWORD:-hawkedge_backup_key_2026}"

if [ ! -f "${ENCRYPTED_FILE}" ]; then
  echo "Error: Encrypted file not found: ${ENCRYPTED_FILE}"
  exit 1
fi

# Derive intermediate filenames
BASE_PATH="${ENCRYPTED_FILE%.enc}"
COMPRESSED_FILE="${BASE_PATH}"
SQL_FILE="${COMPRESSED_FILE%.gz}"

echo "===================================================="
# Log restoring start
echo "HawkEdge Database Recovery Initiated: $(date)"
echo "Source encrypted archive: ${ENCRYPTED_FILE}"
echo "Target DB: ${DB_NAME} on ${DB_HOST}:${DB_PORT}"
echo "===================================================="

# Ensure cleaning is run even on failure
cleanup() {
  echo "// Cleaning temporary variables and files..."
  rm -f "${COMPRESSED_FILE}" "${SQL_FILE}"
}
trap cleanup EXIT

# 1. Decrypt database archive using AES-256-CBC
echo "// Decrypting archive using AES-256-CBC..."
openssl enc -d -aes-256-cbc -pbkdf2 -in "${ENCRYPTED_FILE}" -out "${COMPRESSED_FILE}" -k "${BACKUP_PASSWORD}"

# 2. Decompress sql backup archive
echo "// Decompressing backup archive..."
gzip -d -f "${COMPRESSED_FILE}"

# 3. Connect and execute SQL dump on target Postgres instance
echo "// Restoring SQL schema and data dumps..."
PGPASSWORD="${POSTGRES_PASSWORD:-postgres}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -f "${SQL_FILE}"

echo "===================================================="
echo "Database Recovery Completed Successfully!"
echo "===================================================="
