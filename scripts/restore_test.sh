#!/usr/bin/env bash
# J2 — Uji pemulihan (restore test) dari file dump yang dihasilkan backup.sh.
# Data di-restore ke database sementara, diverifikasi, lalu dihapus.
#
# Pakai:
#   DB_PASS=rahasia ./scripts/restore_test.sh /backup/farmcare/farmcare-db-YYYYMMDD-HHMMSS.sql.gz
#
# Untuk pengujian sebagai root DB (bila user biasa tak punya hak CREATE DATABASE):
#   sudo env DB_HOST=127.0.0.1 DB_USER=root DB_PASS='<root-pass>' \
#        RESTORE_LOG=/backup/farmcare/restore-test.log ./scripts/restore_test.sh <dump>
set -euo pipefail

DUMP="${1:-}"
if [ -z "$DUMP" ] || [ ! -f "$DUMP" ]; then
    echo "Gunakan: DB_PASS=... $0 <file-dump.sql.gz>" >&2
    exit 1
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_USER="${DB_USER:-farmcare}"
DB_PASS="${DB_PASS:-}"
TEST_DB="${TEST_DB:-farmcare_restore_test}"
RESTORE_LOG="${RESTORE_LOG:-$HOME/farmcare-restore-test.log}"

export MYSQL_PWD="$DB_PASS"

mysql -h "$DB_HOST" -u "$DB_USER" \
    -e "DROP DATABASE IF EXISTS \`$TEST_DB\`; CREATE DATABASE \`$TEST_DB\`;"

gunzip -c "$DUMP" | mysql -h "$DB_HOST" -u "$DB_USER" "$TEST_DB"

TABLES=$(mysql -h "$DB_HOST" -u "$DB_USER" -N -e \
    "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$TEST_DB';")

if [ "${TABLES:-0}" -lt 1 ]; then
    echo "GAGAL: tidak ada tabel setelah restore." >&2
    exit 1
fi

echo "Restore test OK. $TABLES tabel dipulihkan ke database $TEST_DB."
printf 'Restore test OK | file=%s | tabel=%s | waktu=%s\n' \
    "$DUMP" "$TABLES" "$(date -Is)" | tee -a "$RESTORE_LOG"

mysql -h "$DB_HOST" -u "$DB_USER" -e "DROP DATABASE IF EXISTS \`$TEST_DB\`;"
echo "Database uji dihapus. Bukti uji dicatat di $RESTORE_LOG"
