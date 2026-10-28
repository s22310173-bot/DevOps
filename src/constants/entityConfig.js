import { ENTITIES } from "./menu";

export const configs = {
  pakan: {
    title: "Manajemen Pakan",
    description: "Kelola pembelian dan persediaan pakan.",
    fields: [
      { name: "tanggal", label: "Tanggal pembelian", type: "date" },
      { name: "nama", label: "Nama pakan", placeholder: "Contoh: Pakan layer" },
      { name: "jumlah", label: "Jumlah masuk (kg)", type: "number" },
      { name: "harga", label: "Harga per kg (Rp)", type: "number", format: "money" },
    ],
  },
  penggunaan: {
    title: "Penggunaan Pakan",
    description: "Catat konsumsi pakan harian.",
    fields: [
      { name: "tanggal", label: "Tanggal penggunaan", type: "date" },
      { name: "nama", label: "Nama pakan", placeholder: "Contoh: Pakan layer" },
      { name: "jumlah", label: "Jumlah digunakan (kg)", type: "number" },
    ],
  },
  produksi: {
    title: "Produksi Telur",
    description: "Pantau hasil produksi harian. Satu catatan per tanggal.",
    fields: [
      { name: "tanggal", label: "Tanggal produksi", type: "date" },
      { name: "jumlah", label: "Total telur dipanen (butir)", type: "number" },
      {
        name: "rusak",
        label: "Termasuk telur rusak (butir)",
        type: "number",
        required: false,
      },
    ],
  },
  penjualan: {
    title: "Penjualan Telur",
    description: "Catat transaksi penjualan telur.",
    fields: [
      { name: "tanggal", label: "Tanggal penjualan", type: "date" },
      { name: "jumlah", label: "Jumlah terjual (butir)", type: "number" },
      { name: "harga", label: "Harga per butir (Rp)", type: "number", format: "money" },
      {
        name: "pelanggan",
        label: "Nama pelanggan",
        placeholder: "Nama pembeli",
        required: false,
      },
    ],
  },
  pengeluaran: {
    title: "Pengeluaran Operasional",
    description: "Catat biaya selain pembelian pakan.",
    fields: [
      { name: "tanggal", label: "Tanggal pengeluaran", type: "date" },
      {
        name: "nama",
        label: "Kategori biaya",
        placeholder: "Contoh: Obat ayam",
      },
      { name: "jumlah", label: "Nominal (Rp)", type: "number", format: "money" },
      {
        name: "keterangan",
        label: "Keterangan",
        placeholder: "Catatan tambahan",
        required: false,
      },
    ],
  },
};

export const emptyData = () =>
  Object.fromEntries(ENTITIES.map((entity) => [entity, []]));

export const emptySummary = {
  feed: {
    inMonth: 0,
    usedMonth: 0,
    stock: 0,
    costMonth: 0,
    usedValue: 0,
    avgPrice: 0,
  },
  eggs: {
    producedMonth: 0,
    damagedMonth: 0,
    goodMonth: 0,
    soldMonth: 0,
    stock: 0,
    productionDays: 0,
    hdPercent: null,
  },
  finance: {
    salesMonth: 0,
    feedCostMonth: 0,
    otherExpensesMonth: 0,
    expensesMonth: 0,
    netMonth: 0,
  },
};
