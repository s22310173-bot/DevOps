# Ringkasan Perbaikan Keamanan (OWASP Audit)

Dokumen ini memetakan tiap item perbaikan ke lokasi implementasi, sebagai bukti
untuk audit ulang.

| Item | Status | Lokasi implementasi |
|------|--------|---------------------|
| **A8** Idle timeout sesi 30 menit | Selesai | `app/bootstrap.php` (`session.gc_maxlifetime=1800` + cek `last_activity`) |
| **C4/C5** Validasi unggah file | N/A | Tidak ada fitur unggah file. Bila ditambahkan nanti: validasi MIME + ekstensi, batasi ukuran, dan rename acak nama file. |
| **D4** Content-Security-Policy | Selesai | `app/bootstrap.php` (CSP `default-src 'self'` + allowlist CDN, tanpa `unsafe-inline`) & `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` |
| **F5** Redirect HTTP→HTTPS | Selesai | `.htaccess` (IP `103.139.192.112` dan `juiziy.xyz` http → `https://juiziy.xyz`) |
| **G2** Username di log login gagal | Selesai | `app/Controllers/AuthController.php` (`error_log` + audit) |
| **G3** Audit log aksi admin | Selesai | `app/Core/Audit.php` + panggilan di `AuthController`, `EntityController`, `SettingsController`; output `storage/logs/audit.log` (JSON lines) |
| **G5** Pemantauan log otomatis | Selesai | `scripts/monitor_logs.sh` (email/Slack) |
| **G6** Analisis anomali log | Selesai (heuristik) | `scripts/analyze_anomalies.sh` |
| **H4** Permission file/folder | Selesai | `deploy/deploy.sh` & wrapper (folder `755`, file `644`, `.env` `640`, `storage/logs` `750` milik `www-data`) |
| **H6** Nonaktifkan fungsi berbahaya | Selesai (config) | `deploy/php-security.ini` (`disable_functions`) — terapkan ke `php.ini` server |
| **J1** Folder backup terpisah | Selesai | `scripts/backup.sh` (default `/backup/farmcare`, di luar docroot) |
| **J2** Uji restore | Selesai | `scripts/restore_test.sh` (mencatat bukti uji) |
| **J3** Backup off-site + retensi | Selesai | `scripts/backup.sh` (`OFFSITE_REMOTE` via rclone, `RETENTION_DAYS`) |

## Format audit log (G3)

Setiap baris `storage/logs/audit.log` berupa JSON:

```json
{"timestamp":"2026-11-24T10:00:00+08:00","action":"update","resource":"produksi#42","user_id":"admin","ip":"103.139.192.112"}
```

Nilai `action`: `login`, `login_failed`, `create`, `update`, `delete`.

## Catatan operasional

- Folder `storage/` diblokir dari akses web via `.htaccess` dan di-*exclude* dari
  rsync deploy; dibuat otomatis oleh `deploy.sh`.
- Header CSP hanya dikirim untuk respons dinamis (HTML). Aset statis disajikan
  langsung oleh Apache dan tidak memerlukan CSP.
- Redirect HTTPS/domain bersifat produksi; untuk pengembangan lokal gunakan
  `php -S` (tidak membaca `.htaccess`).
