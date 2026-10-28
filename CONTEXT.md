# FarmCare

Aplikasi operasional untuk satu peternakan ayam petelur skala kecil yang dikelola satu admin.

## Language

**Peternakan**:
Satu lokasi usaha peternakan ayam petelur yang dikelola satu admin. Saat ini berisi tepat satu kandang.
_Avoid_: Farm, tenant, cabang

**Kandang**:
Unit hunian tunggal berisi 500–1000 ayam petelur. Seluruh pakan, produksi, dan penjualan tercatat pada kandang ini.
_Avoid_: Flock, batch, gudang

**Populasi**:
Jumlah ayam yang ada di kandang, dicatat sekali dan dianggap tetap. Kematian dan afkir tidak dilacak.
_Avoid_: Flock size, jumlah ayam masuk, mortalitas

**Stok pakan**:
Saldo pakan yang tersisa di gudang, dihitung kumulatif dari seluruh pakan masuk dikurangi seluruh pakan terpakai sejak awal. Tidak di-reset per periode.
_Avoid_: Sisa pakan bulan ini, persediaan periodik

**Produksi telur**:
Jumlah telur yang dipanen dari kandang dalam satu catatan. Angka totalnya sudah termasuk telur rusak.
_Avoid_: Panen, output, hasil

**Telur rusak**:
Bagian dari produksi telur yang tidak bisa dijual. Selalu merupakan subset dari total produksi, bukan tambahan di luarnya.
_Avoid_: Reject, afkir telur, telur pecah
