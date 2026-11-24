#!/usr/bin/env bash
# G5 — Pemantauan log otomatis.
# Jadwalkan lewat cron, contoh (tiap jam):
#   0 * * * * /var/www/html/devops/scripts/monitor_logs.sh >> /var/log/farmcare-monitor.log 2>&1
#
# Variabel lingkungan opsional:
#   ACCESS_LOG, ERROR_LOG, AUDIT_LOG, THRESHOLD, ALERT_EMAIL, SLACK_WEBHOOK
set -euo pipefail

ACCESS_LOG="${ACCESS_LOG:-/var/log/apache2/access.log}"
ERROR_LOG="${ERROR_LOG:-/var/log/apache2/error.log}"
AUDIT_LOG="${AUDIT_LOG:-/var/www/html/devops/storage/logs/audit.log}"
THRESHOLD="${THRESHOLD:-50}"
ALERT_EMAIL="${ALERT_EMAIL:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

send_alert() {
    local subject="$1" body="$2"
    echo "[alert] $subject — $body"

    if [ -n "$ALERT_EMAIL" ] && command -v mail >/dev/null 2>&1; then
        printf '%s\n' "$body" | mail -s "FarmCare: $subject" "$ALERT_EMAIL" || true
    fi

    if [ -n "$SLACK_WEBHOOK" ] && command -v curl >/dev/null 2>&1; then
        local payload
        payload=$(printf '%s' "$subject — $body" | sed 's/\\/\\\\/g; s/"/\\"/g')
        curl -fsS -X POST -H 'Content-Type: application/json' \
            --data "{\"text\":\"${payload}\"}" "$SLACK_WEBHOOK" >/dev/null 2>&1 || true
    fi
}

check_count() {
    local log="$1" pattern="$2" label="$3"
    [ -f "$log" ] || return 0
    local count
    count=$(grep -cE "$pattern" "$log" 2>/dev/null || true)
    count=${count:-0}
    if [ "$count" -ge "$THRESHOLD" ]; then
        send_alert "Anomali: $label" "$count kemunculan pola '$pattern' di $log"
    fi
}

check_count "$ACCESS_LOG" '" (404|419) ' "HTTP 404/419 berlebihan"
check_count "$ACCESS_LOG" '" 5[0-9][0-9] ' "HTTP 5xx berlebihan"
check_count "$ERROR_LOG" 'PHP (Fatal|Parse) error' "PHP fatal/parse error"
check_count "$ERROR_LOG" 'login gagal' "Percobaan login gagal berlebihan"

if [ -f "$AUDIT_LOG" ]; then
    top_ip=$(grep -oE '"ip":"[^"]+"' "$AUDIT_LOG" | sort | uniq -c | sort -rn | head -n 1 || true)
    [ -n "$top_ip" ] && echo "[info] IP paling aktif di audit log: $top_ip"
fi

echo "[monitor] selesai $(date -Is)"
