# Pindah FarmCare ke VPS dengan Docker, Jenkins, dan nginx-proxy

ADR 0001 memutuskan FarmCare berjalan sepenuhnya di satu komputer dengan XAMPP. Kebutuhan berubah: aplikasi harus terbuka di domain juiziy.xyz dari mana saja, dan setiap push ke GitHub harus otomatis ter-update di web.

Keputusan: FarmCare berjalan di satu VPS (Debian/Ubuntu) dengan Docker Compose berisi lima service:

- `web` — nginx yang menyajikan build frontend dan meneruskan `/api` ke Express.
- `api` — Express + Prisma (jalur `server/`).
- `db` — MariaDB (skema Prisma `provider = "mysql"` tetap, tanpa porting).
- `nginx-proxy` — menerima port 80/443, routing berdasarkan Host (`juiziy.xyz`, `www.juiziy.xyz`), redirect HTTP→HTTPS, dan lokasi challenge ACME.
- `acme` — acme-companion: menerbitkan dan memperpanjang sertifikat Let's Encrypt secara otomatis.

Jenkins berjalan sebagai service host di VPS yang sama. Webhook GitHub memicu `Jenkinsfile`: lint (di container) → `docker compose build` → `prisma db push` → `docker compose up -d --wait` → health check. Push ke `main` = deploy. Rahasia disimpan di `.env` (di-ignore git).

Konsekuensi yang disadari:

- VPS disarankan minimal 4GB RAM karena Jenkins, MariaDB, dan aplikasi berbagi satu mesin.
- `nginx-proxy` dan `acme-companion` mem-mount `/var/run/docker.sock`; Jenkins menjalankan perintah docker. Keamanan VPS bergantung pada autentikasi Jenkins dan isi repo ini.
- Data produksi pindah dari XAMPP lokal ke volume Docker `db-data`; backup database menjadi tanggung jawab manual/terjadwal.
- Sertifikat Let's Encrypt (HTTP-01) butuh DNS `juiziy.xyz`/`www.juiziy.xyz` sudah menunjuk ke VPS dan port 80 terbuka sebelum deploy pertama berhasil sempurna.

Opsi yang ditolak:

- Nginx + PM2 tanpa Docker (Docker dipilih agar build dan runtime identik serta mudah dipindah antar VPS).
- Caddy sebagai pengganti nginx-proxy (nginx-proxy + acme-companion adalah pola resmi yang sudah teruji).
- PostgreSQL (skema sudah MySQL; porting tidak memberi nilai untuk skala aplikasi ini).
- Jenkins di komputer lokal (pipeline mati selama komputer dev mati).
- Menjalankan Jenkins di dalam container (butuh docker.sock di kontainer Jenkins dan pengelolaan workspace yang lebih rumit).

Referensi: ADR 0001 (diperbarui oleh ADR ini), panduan lengkap di `docs/deploy.md`.
