# Deploy FarmCare (PHP) ke VPS juiziy.xyz

Runtime: Apache host + PHP 8.1 + MariaDB host, docroot `/var/www/html/devops`.

## Prasyarat server

```bash
sudo apt-get update
sudo apt-get install -y php8.1 libapache2-mod-php8.1 php8.1-mysql php8.1-mbstring php8.1-curl
sudo a2dismod php7.4
sudo a2enmod php8.1 rewrite
```

## Database

Buat database dan user (sesuaikan password, lalu samakan di `.env`):

```sql
CREATE DATABASE farmcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'farmcare'@'localhost' IDENTIFIED BY 'ganti-password';
GRANT ALL PRIVILEGES ON farmcare.* TO 'farmcare'@'localhost';
FLUSH PRIVILEGES;
```

Impor data (dari backup lama bila ada):

```bash
mysql -uroot -p farmcare < backup.sql
```

## Konfigurasi aplikasi

Buat `/var/www/html/devops/.env` (jangan di-commit):

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=farmcare
DB_USER=farmcare
DB_PASS=ganti-password

ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<hasil password_hash>
```

## Deploy file

Dari mesin yang punya akses SSH:

```bash
./deploy/deploy.sh            # deploy dari folder proyek ini
```

Skrip akan menyinkronkan source ke `/var/www/html/devops`, mengatur permission
(owner `juiziy:www-data`), dan me-reload Apache. File `.env` di server tidak ditimpa.

## Apache

Vhost `/etc/apache2/sites-enabled/000-default.conf` dan
`000-default-le-ssl.conf` sudah menunjuk ke `/var/www/html/devops` dengan
`AllowOverride All`. Pastikan port 80/443 tidak dipakai proses lain
(mis. container Docker nginx-proxy):

```bash
sudo docker stop farmcare-web-1 farmcare-api-1 farmcare-nginx-proxy-1 farmcare-acme-1
sudo systemctl enable --now apache2
```

## Sertifikat SSL

Sertifikat Let's Encrypt dikelola `certbot` (timer aktif). Perpanjang manual:

```bash
sudo certbot renew --dry-run
```

## CI/CD (Jenkins)

`Jenkinsfile` di root melakukan: checkout → lint PHP → `sudo -n /usr/local/bin/farmcare-deploy` → verifikasi.

Deploy dijalankan lewat wrapper root `/usr/local/bin/farmcare-deploy` (sinkron
`/opt/farmcare` → `/var/www/html/devops`, atur permission, reload Apache). Beri Jenkins
sudo NOPASSWD hanya untuk wrapper itu, lewat `/etc/sudoers.d/farmcare-deploy`:

```
jenkins ALL=(root) NOPASSWD: /usr/local/bin/farmcare-deploy
```

Buat wrapper (root:root, 755) dengan isi:

```bash
#!/usr/bin/env bash
set -euo pipefail
SRC="${1:-/opt/farmcare}"
TARGET="${TARGET:-/var/www/html/devops}"
rsync -a --delete --exclude '.git' --exclude '.env' --exclude 'deploy' \
  --exclude 'docs' --exclude 'scripts' --exclude 'storage' --exclude 'Jenkinsfile' \
  --exclude 'README.md' --exclude 'CONTEXT.md' --exclude '.gitignore' \
  --exclude '.env.example' \
  "$SRC/" "$TARGET/"
chown -R juiziy:www-data "$TARGET"
find "$TARGET" -type d -exec chmod 755 {} +
find "$TARGET" -type f -exec chmod 644 {} +
[ -f "$TARGET/.env" ] && chmod 640 "$TARGET/.env"
install -d -o www-data -g www-data -m 750 "$TARGET/storage/logs"
systemctl reload apache2
```

Untuk deploy manual di server, `sudo deploy/deploy.sh` juga bisa dipakai.

## Penguatan PHP (disable_functions)

Gabungkan isi `deploy/php-security.ini` ke `php.ini` server lalu restart:

```bash
sudo cp deploy/php-security.ini /etc/php/8.1/apache2/conf.d/99-farmcare.ini
sudo systemctl restart apache2
php8.1 -i | grep disable_functions   # verifikasi
```

## Pemantauan log (G5/G6)

Skrip disalin ke `/opt/farmcare/scripts` (tidak ikut ke docroot). Jadwalkan lewat
`/etc/cron.d/farmcare`:

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# G5: pemantauan log tiap jam
0 * * * * root /opt/farmcare/scripts/monitor_logs.sh >> /var/log/farmcare-monitor.log 2>&1
# G6: analisis anomali harian 06:15
15 6 * * * root /opt/farmcare/scripts/analyze_anomalies.sh >> /var/log/farmcare-anomali.log 2>&1
# J1/J3: backup harian 02:00
0 2 * * * root BACKUP_DIR=/backup/farmcare RETENTION_DAYS=30 /opt/farmcare/scripts/backup.sh >> /var/log/farmcare-backup.log 2>&1
```

Isi `SLACK_WEBHOOK` / `ALERT_EMAIL` pada `monitor_logs.sh` (atau environment) agar
peringatan terkirim.

## Backup & restore (J1/J2/J3)

`backup.sh` membaca kredensial DB dari `.env` aplikasi secara otomatis. Backup
disimpan di folder terpisah `/backup/farmcare` (di luar docroot). Agar memenuhi
**J3 (off-site)**, pasang `rclone` lalu isi `OFFSITE_REMOTE` (mis. `gdrive:farmcare`).

Uji restore berkala (catat hasilnya sebagai bukti). Bila user DB tidak punya hak
`CREATE DATABASE`, jalankan sebagai root DB:

```bash
sudo env DB_HOST=127.0.0.1 DB_USER=root DB_PASS='<root-pass>' \
    RESTORE_LOG=/backup/farmcare/restore-test.log \
    /opt/farmcare/scripts/restore_test.sh /backup/farmcare/farmcare-db-TANGGAL.sql.gz
```

Bukti uji ditulis ke `/backup/farmcare/restore-test.log`.

Status pemeriksaan keamanan lengkap ada di `docs/security.md`.
