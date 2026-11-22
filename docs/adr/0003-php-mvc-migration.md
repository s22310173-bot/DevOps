# 0003 — Migrasi ke PHP MVC (Apache host)

Status: Diterima

## Konteks

Versi awal FarmCare memakai React + Vite (frontend SPA) dan Express + Prisma
(API) di MariaDB, dijalankan via Docker Compose di belakang nginx-proxy, dengan
CI/CD Jenkins. Aplikasinya kecil: satu admin, lima entitas CRUD, satu laporan
bulanan. Pemilik proyek lebih nyaman merawat stack PHP di hosting/VPS dengan
Apache dan menginginkan kode berada di `/var/www/html`.

## Keputusan

Menulis ulang aplikasi sebagai **PHP MVC murni** (tanpa framework, tanpa
Composer) dengan tampilan **server-rendered** berbasis Bootstrap 5 + jQuery.
Runtime memakai Apache host + PHP 8.1 + MariaDB host. Data lama dimigrasikan
dari volume Docker ke MariaDB host.

## Konsekuensi

- Satu stack (PHP) tanpa Node/build step; deploy cukup sinkron file.
- Autentikasi admin ditambahkan (session + CSRF + `password_hash`) karena
  aplikasi terekspos publik.
- Docker Compose, Prisma, dan pipeline lama dipensiunkan; Jenkins kini
  melakukan lint PHP lalu `deploy/deploy.sh`.
- Skema data tetap sama dengan versi Prisma (tabel & kolom identik).
