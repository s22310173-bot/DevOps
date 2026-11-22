# Deploy FarmCare (PHP) ke VPS juiziy.xyz

Runtime: Apache host + PHP 8.1 + MariaDB host, docroot `/var/www/html`.

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

Buat `/var/www/html/.env` (jangan di-commit):

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

Skrip akan menyinkronkan source ke `/var/www/html`, mengatur permission,
dan me-reload Apache. File `.env` di server tidak ditimpa.

## Apache

Vhost `/etc/apache2/sites-enabled/000-default.conf` dan
`000-default-le-ssl.conf` sudah menunjuk ke `/var/www/html` dengan
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

`Jenkinsfile` di root melakukan: checkout → lint PHP → `deploy/deploy.sh` → verifikasi.

Agar Jenkins bisa menulis ke `/var/www/html`, beri sudo NOPASSWD khusus untuk
skrip deploy, contoh `/etc/sudoers.d/farmcare-deploy`:

```
jenkins ALL=(root) NOPASSWD: /usr/bin/rsync, /usr/bin/chown, /usr/bin/find, /usr/bin/chmod, /usr/bin/systemctl reload apache2
```

Sesuaikan bila path binary berbeda (`which rsync`).
