# FarmCare

Aplikasi operasional satu peternakan ayam petelur yang dikelola satu admin: pakan, produksi telur, penjualan, dan pengeluaran dicatat untuk kandang yang ada.

## Struktur

- `src/` — frontend React + Vite (SPA, routing dengan react-router)
- `server/` — API Express + Prisma untuk MariaDB
- `docker-compose.yml`, `Dockerfile`, `server/Dockerfile`, `deploy/nginx.conf` — runtime produksi di VPS
- `Jenkinsfile` — pipeline CI/CD (GitHub → Jenkins → deploy)
- `docs/deploy.md` — panduan lengkap deploy ke VPS juiziy.xyz
- `docs/adr/` — keputusan arsitektur
- `docs/legacy/` — skrip deploy XAMPP lama (tidak dipakai lagi)

## Menjalankan secara lokal

```bash
npm install
cp server/.env.example server/.env    # lalu isi password database
npm run api                           # API di http://127.0.0.1:3001
npm run dev                           # frontend di http://localhost:5173 (proxy /api ke 3001)
```

Perintah lain: `npm run lint`, `npm run build`, `npm run db:push`.

## Deploy

Push ke branch `main` → Jenkins membangun, menguji, dan men-deploy otomatis ke https://juiziy.xyz.

Bootstrap VPS (sekali): ikuti `docs/deploy.md`.
