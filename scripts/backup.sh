#!/usr/bin/env bash
# J1/J3 — Backup database + file aplikasi ke folder terpisah (di luar docroot),
# opsional dikirim off-site via rclone. Simpan retensi beberapa hari.
#
# Pakai (manual):
#   ./scripts/backup.sh
#
# Jadwalkan lewat cron harian (mis. 02:00):
#   0 2 * * * BACKUP_DIR=/backup/farmcare /var/www/html/devops/scripts/backup.sh >> /var/log/farmcare-backup.log 2>&1
#
# Variabel lingkungan:
#   APP_DIR (default /var/www/html/devops)
#   BACKUP_DIR (default /backup/farmcare — WAJIB di luar docroot)
#   APP_ENV_FILE (default $APP_DIR/.env — sumber kredensial DB)
#   DB_HOST, DB_NAME, DB_USER, DB_PASS (boleh lewat env; jika kosong diambil dari .env)
#   RETENTION_DAYS (default 30)
#   OFFSITE_REMOTE (opsional, mis. gdrive:farmcare atau s3:mybucket/farmcare)
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/html/devops}"
BACKUP_DIR="${BACKUP_DIR:-/backup/farmcare}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
OFFSITE_REMOTE="${OFFSITE_REMOTE:-}"

# Muat kredensial DB dari .env aplikasi (parser sederhana, tanpa eval).
APP_ENV_FILE="${APP_ENV_FILE:-$APP_DIR/.env}"
if [ -f "$APP_ENV_FILE" ]; then
    while IFS= read -r line; do
        case "$line" in
            DB_HOST=*|DB_PORT=*|DB_NAME=*|DB_USER=*|DB_PASS=*)
                key=${line%%=*}
                val=${line#*=}
                if [ -z "${!key:-}" ]; then
                    export "$key=$val"
                fi
                ;;
        esac
    done < "$APP_ENV_FILE"
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_NAME="${DB_NAME:-farmcare}"
DB_USER="${DB_USER:-farmcare}"
DB_PASS="${DB_PASS:-}"

if [ "$BACKUP_DIR" = "$APP_DIR" ] || [[ "$BACKUP_DIR" == "$APP_DIR"/* ]]; then
    echo "BACKUP_DIR tidak boleh berada di dalam docroot aplikasi." >&2
    exit 1
fi

mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
DUMP="$BACKUP_DIR/farmcare-db-$STAMP.sql.gz"
FILES="$BACKUP_DIR/farmcare-files-$STAMP.tar.gz"

MYSQL_PWD="$DB_PASS" mysqldump --single-transaction --quick --no-tablespaces \
    -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" | gzip > "$DUMP"

tar -czf "$FILES" -C "$(dirname "$APP_DIR")" "$(basename "$APP_DIR")"

if [ -n "$OFFSITE_REMOTE" ] && command -v rclone >/dev/null 2>&1; then
    rclone copy "$DUMP" "$OFFSITE_REMOTE" && echo "Upload off-site: $DUMP"
    rclone copy "$FILES" "$OFFSITE_REMOTE" && echo "Upload off-site: $FILES"
else
    echo "[info] OFFSITE_REMOTE kosong / rclone tidak ada — backup hanya lokal."
fi

find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -delete
echo "Backup selesai $(date -Is): $DUMP , $FILES"
