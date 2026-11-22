# FarmCare (PHP MVC)

Aplikasi operasional peternakan ayam petelur (satu admin): pakan, produksi telur,
penjualan, dan pengeluaran. Versi ini adalah hasil migrasi dari React + Express +
Prisma ke **PHP MVC murni** (tanpa framework), dengan tampilan server-rendered
berbasis Bootstrap 5 + jQuery.

## Stack

- PHP 8.1 (PDO MySQL)
- Apache 2.4 (`mod_rewrite`, `mod_php`)
- MariaDB/MySQL
- Bootstrap 5 + jQuery (CDN)
- Tanpa Composer, tanpa build step

## Struktur

```
index.php              # front controller
.htaccess              # rewrite + blokir akses /app dan dotfiles
app/
  bootstrap.php        # autoloader, .env, session
  routes.php           # tabel rute
  Config/entities.php  # definisi 5 entitas (field, validasi, tabel)
  Core/                # Router, Database, Controller, Auth, Csrf, Validator, helpers
  Controllers/         # Auth, Dashboard, Entity, Report, Settings
  Models/              # EntityModel, Summary, Setting
  Views/               # layouts, auth, dashboard, entities, report
assets/                # css/js
deploy/deploy.sh       # skrip deploy ke /var/www/html
```

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env`, isi kredensial DB dan hash password admin.
2. Buat database dan impor skema/data (lihat `docs/deploy.md`).
3. Arahkan DocumentRoot Apache ke folder proyek, atau jalankan
   `php -S 127.0.0.1:8000` (butuh rewrite fallback manual).

## Akun admin

Kredensial diatur lewat `.env`:

```
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=...
```

Buat hash password:

```bash
php -r "echo password_hash('password-baru', PASSWORD_DEFAULT), PHP_EOL;"
```

## Deploy

Lihat `docs/deploy.md`.
