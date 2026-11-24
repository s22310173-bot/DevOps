#!/usr/bin/env bash
# G6 — Analisis anomali log sederhana (heuristik).
# Mendeteksi IP yang menghasilkan banyak error 5xx / 404, indikatif serangan
# atau kegagalan sistem. Bisa dijadwalkan lewat cron atau dijalankan manual.
#
#   ACCESS_LOG=/var/log/apache2/access.log THRESHOLD=20 ./scripts/analyze_anomalies.sh
set -euo pipefail

ACCESS_LOG="${ACCESS_LOG:-/var/log/apache2/access.log}"
THRESHOLD="${THRESHOLD:-20}"

if [ ! -f "$ACCESS_LOG" ]; then
    echo "Log akses tidak ditemukan: $ACCESS_LOG" >&2
    exit 0
fi

echo "== IP dengan >= $THRESHOLD error 5xx =="
awk '$9 ~ /^5[0-9][0-9]$/ {print $1}' "$ACCESS_LOG" \
    | sort | uniq -c | sort -rn \
    | awk -v t="$THRESHOLD" '$1 >= t {printf "  %-15s %s request\n", $2, $1}'

echo "== IP dengan >= $THRESHOLD respons 404 =="
awk '$9 == "404" {print $1}' "$ACCESS_LOG" \
    | sort | uniq -c | sort -rn \
    | awk -v t="$THRESHOLD" '$1 >= t {printf "  %-15s %s request\n", $2, $1}'

echo "== Selesai $(date -Is) =="
