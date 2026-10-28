# Jalankan FarmCare di satu komputer dengan XAMPP, bukan VPS

Rencana awal adalah self-hosted di VPS dengan PostgreSQL, Docker, dan Jenkins. VPS bermasalah dan aplikasi hanya dipakai satu admin di satu komputer, jadi kesederhanaan operasional lebih penting daripada akses jarak jauh.

Keputusan: FarmCare berjalan sepenuhnya di satu komputer. XAMPP menyediakan Apache (menyajikan build frontend dan meneruskan `/api`) dan MariaDB (database). Backend Node.js + Express berjalan terpisah dan tidak dijalankan oleh XAMPP. Tidak ada autentikasi, Docker, Jenkins, atau PostgreSQL.

Konsekuensi yang disadari:

- Data tidak bisa diakses dari perangkat lain; backup database menjadi tanggung jawab manual/terjadwal.
- Node dan Apache adalah dua proses berbeda yang harus sama-sama hidup; XAMPP tidak mengelola Node.
- Pindah ke PostgreSQL di masa depan berarti porting skema, bukan sekadar ganti koneksi.

Opsi yang ditolak: PostgreSQL di VPS (dibatalkan karena VPS bermasalah), SQLite (paling sederhana untuk satu komputer, tetapi tidak dipilih karena ingin memakai MariaDB dari XAMPP).
