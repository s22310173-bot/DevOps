export const menus = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "pakan", label: "Manajemen Pakan", icon: "◈" },
  { id: "penggunaan", label: "Penggunaan Pakan", icon: "↘" },
  { id: "produksi", label: "Produksi Telur", icon: "🥚" },
  { id: "penjualan", label: "Penjualan Telur", icon: "↗" },
  { id: "pengeluaran", label: "Pengeluaran", icon: "▤" },
  { id: "laporan", label: "Laporan", icon: "▥" },
];

export const ENTITIES = [
  "pakan",
  "penggunaan",
  "produksi",
  "penjualan",
  "pengeluaran",
];

export const menuById = (id) => menus.find((menu) => menu.id === id);
