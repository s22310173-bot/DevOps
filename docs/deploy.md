# Deploy FarmCare ke VPS (juiziy.xyz)

Panduan satu kali (bootstrap) untuk VPS Debian/Ubuntu. Setelah selesai, **setiap push ke branch `main` di GitHub akan otomatis ter-deploy** oleh Jenkins.

Arsitektur: GitHub --push/webhook--> Jenkins (host VPS) --> Docker Compose (`db`, `api`, `web`, `nginx-proxy`, `acme`) --> https://juiziy.xyz

Prasyarat:

- VPS Debian/Ubuntu dengan RAM **minimal 4GB** (Jenkins + MariaDB + aplikasi).
- Domain **juiziy.xyz** sudah terbeli, dengan panel DNS yang bisa diedit.
- Akses root/`sudo` ke VPS.

---

## 1. DNS

Buat record berikut di provider domain, menunjuk ke IP VPS:

| Type  | Name | Value    |
|-------|------|----------|
| A     | `@`  | IP VPS   |
| A     | `www`| IP VPS   |

(Butuh keduanya karena `www.juiziy.xyz` ikut disertakan di konfigurasi TLS.)

## 2. Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # lalu logout/login lagi
docker --version && docker compose version   # compose v2.20 ke atas
```

## 3. Install Jenkins

```bash
sudo apt update && sudo apt install -y curl git openjdk-21-jre
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /etc/apt/keyrings/jenkins-keyring.asc > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update && sudo apt install -y jenkins
sudo systemctl enable --now jenkins
```

Tambahkan user Jenkins ke grup docker:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Buka firewall (kalau memakai `ufw`):

```bash
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw allow 8080
sudo ufw enable
```

Selesai instalasi Jenkins:

1. Buka `http://IP-VPS:8080`, ikuti setup wizard, **buat akun admin dengan password kuat** (Jenkins terbuka publik di port 8080).
2. **Manage Jenkins → System → Jenkins URL**: isi `http://IP-VPS:8080/`.
3. **Manage Jenkins → Plugins → Available**: pasang plugin **Git**, **GitHub**, dan **Pipeline** (biasanya sudah terpasang bawaan; pastikan).

## 4. Siapkan repo dan `.env` di VPS

```bash
sudo mkdir -p /opt/farmcare && sudo chown -R $USER:$USER /opt/farmcare
git clone https://github.com/s22310173-bot/DevOps.git /opt/farmcare
cd /opt/farmcare
cp .env.example .env
nano .env    # isi MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD (huruf+angka), ACME_EMAIL
chmod 600 .env
```

Repo bersifat publik, jadi clone tidak perlu kredensial. **`.env` tidak boleh di-commit** (sudah di-ignore).

## 5. Job Jenkins

1. **New Item → Pipeline**, nama: `farmcare`.
2. **Pipeline**: pilih *Pipeline script from SCM*:
   - SCM: Git
   - Repository URL: `https://github.com/s22310173-bot/DevOps.git`
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
3. Di bagian **Advanced** (Pipeline), centang/isi **Use custom workspace**:
   - Directory: `/opt/farmcare`

   (Supaya file `.env` tetap ada di antara build — jangan aktifkan opsi "Clean before checkout"/wipe workspace.)
4. **Build Triggers**: centang **GitHub hook trigger for GITScm polling**.
5. **Save**.

## 6. Webhook GitHub

Di repo GitHub: **Settings → Webhooks → Add webhook**:

- Payload URL: `http://IP-VPS:8080/github-webhook/`
- Content type: `application/json`
- Events: centang **Push events**
- Active: centang

Klik *Redeliver* sekali untuk memastikan berstatus 200.

## 7. Build pertama & verifikasi

Klik **Build Now** di job `farmcare`. Urutan pipeline: lint → build image → `prisma db push` → `docker compose up -d --wait` → health check.

Setelah hijau:

```bash
curl https://juiziy.xyz/api/health        # {"status":"ok"}
```

Buka https://juiziy.xyz di browser. Catatan deploy pertama:

- Sertifikat Let's Encrypt diterbitkan detik-menit setelah container hidup; sebelum itu browser mungkin memperingatkan sertifikat (self-signed bawaan) — akan hilang sendiri.
- Kalau pipeline gagal di bagian health check, lihat log: `docker compose logs --tail=100 api web nginx-proxy acme`.

## Operasi harian

| Kegiatan | Cara |
|---|---|
| Update aplikasi | `git push origin main` → Jenkins otomatis deploy |
| Lihat status | Buka `http://IP-VPS:8080` → job `farmcare` |
| Log container | `cd /opt/farmcare && docker compose logs -f api web` |
| Restart semua | `docker compose restart` |
| Backup database | `docker compose exec db sh -c 'mariadb-dump -uroot -p$MARIADB_ROOT_PASSWORD farmcare' > backup-$(date +%F).sql` |

Troubleshooting singkat:

- **Webhook tidak masuk** → pastikan URL-nya `http://IP-VPS:8080/github-webhook/` dan Jenkins bisa diakses dari internet.
- **Pipeline gagal `permission denied` pada docker** → `sudo usermod -aG docker jenkins && sudo systemctl restart jenkins`.
- **404 di semua halaman** → build frontend bermasalah: cek stage Lint/Build di Jenkins.
- **`/api` 502** → `docker compose ps` (api/db harus `healthy`), lalu `docker compose logs api`.
- **Sertifikat tidak terbit** → cek DNS sudah resolve ke IP VPS dan port 80 terbuka: `curl -sI http://juiziy.xyz | head -1`.

Keputusan arsitektur terkait: `docs/adr/0002-vps-docker-jenkins.md` (menggantikan ADR 0001 untuk jalur produksi).
