import { useEffect, useMemo, useState } from "react";
import "./App.css";

const menus = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "pakan", label: "Manajemen Pakan", icon: "◈" },
  { id: "penggunaan", label: "Penggunaan Pakan", icon: "↘" },
  { id: "produksi", label: "Produksi Telur", icon: "🥚" },
  { id: "penjualan", label: "Penjualan Telur", icon: "↗" },
  { id: "pengeluaran", label: "Pengeluaran", icon: "▤" },
  { id: "laporan", label: "Laporan", icon: "▥" },
];

const configs = {
  pakan: {
    title: "Manajemen Pakan",
    description: "Kelola pembelian dan persediaan pakan.",
    fields: [
      { name: "tanggal", label: "Tanggal pembelian", type: "date" },
      { name: "nama", label: "Nama pakan", placeholder: "Contoh: Pakan layer" },
      { name: "jumlah", label: "Jumlah masuk (kg)", type: "number" },
      { name: "harga", label: "Harga per kg (Rp)", type: "number" },
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
    description: "Pantau hasil produksi harian.",
    fields: [
      { name: "tanggal", label: "Tanggal produksi", type: "date" },
      { name: "jumlah", label: "Jumlah telur (butir)", type: "number" },
      { name: "rusak", label: "Telur rusak (butir)", type: "number" },
    ],
  },
  penjualan: {
    title: "Penjualan Telur",
    description: "Catat transaksi penjualan telur.",
    fields: [
      { name: "tanggal", label: "Tanggal penjualan", type: "date" },
      { name: "jumlah", label: "Jumlah terjual (butir)", type: "number" },
      { name: "harga", label: "Harga per butir (Rp)", type: "number" },
      {
        name: "pelanggan",
        label: "Nama pelanggan",
        placeholder: "Nama pembeli",
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
      { name: "jumlah", label: "Nominal (Rp)", type: "number" },
      {
        name: "keterangan",
        label: "Keterangan",
        placeholder: "Catatan tambahan",
      },
    ],
  },
};

const initialData = {
  pakan: [
    {
      id: 1,
      tanggal: "2026-10-01",
      nama: "Pakan layer",
      jumlah: 1500,
      harga: 8500,
    },
  ],
  penggunaan: [
    { id: 2, tanggal: "2026-10-01", nama: "Pakan layer", jumlah: 250 },
  ],
  produksi: [{ id: 3, tanggal: "2026-10-01", jumlah: 1800, rusak: 20 }],
  penjualan: [
    {
      id: 4,
      tanggal: "2026-10-01",
      jumlah: 1200,
      harga: 500,
      pelanggan: "Pelanggan umum",
    },
  ],
  pengeluaran: [
    {
      id: 5,
      tanggal: "2026-10-01",
      nama: "Obat ayam",
      jumlah: 250000,
      keterangan: "Contoh biaya",
    },
  ],
};

const money = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const number = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const today = () => new Date().toISOString().slice(0, 10);

function readData() {
  try {
    const saved = localStorage.getItem("peternakan-data");
    return saved ? { ...initialData, ...JSON.parse(saved) } : initialData;
  } catch {
    return initialData;
  }
}

export default function App() {
  const [data, setData] = useState(readData);
  const [page, setPage] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(today().slice(0, 7));

  useEffect(() => {
    localStorage.setItem("peternakan-data", JSON.stringify(data));
  }, [data]);

  const monthData = useMemo(() => {
    const inMonth = (item) => item.tanggal?.startsWith(month);
    return Object.fromEntries(
      Object.keys(initialData).map((key) => [
        key,
        (data[key] || []).filter(inMonth),
      ]),
    );
  }, [data, month]);

  const totals = useMemo(() => {
    const feedIn = monthData.pakan.reduce(
      (s, x) => s + Number(x.jumlah || 0),
      0,
    );
    const feedUsed = monthData.penggunaan.reduce(
      (s, x) => s + Number(x.jumlah || 0),
      0,
    );
    const feedCost = monthData.pakan.reduce(
      (s, x) => s + Number(x.jumlah || 0) * Number(x.harga || 0),
      0,
    );
    const sales = monthData.penjualan.reduce(
      (s, x) => s + Number(x.jumlah || 0) * Number(x.harga || 0),
      0,
    );
    const otherExpenses = monthData.pengeluaran.reduce(
      (s, x) => s + Number(x.jumlah || 0),
      0,
    );
    const eggs = monthData.produksi.reduce(
      (s, x) => s + Number(x.jumlah || 0),
      0,
    );
    const damaged = monthData.produksi.reduce(
      (s, x) => s + Number(x.rusak || 0),
      0,
    );

    return {
      feedIn,
      feedUsed,
      stock: feedIn - feedUsed,
      feedCost,
      sales,
      otherExpenses,
      expenses: feedCost + otherExpenses,
      eggs,
      damaged,
      net: sales - feedCost - otherExpenses,
    };
  }, [monthData]);

  function openCreate() {
    setEditing(null);
    setForm({ tanggal: today() });
    setShowForm(true);
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm({ ...item });
    setShowForm(true);
  }

  function saveForm(event) {
    event.preventDefault();
    const item = {
      ...form,
      id: editing ?? Date.now(),
    };

    setData((prev) => ({
      ...prev,
      [page]: editing
        ? prev[page].map((x) => (x.id === editing ? item : x))
        : [...prev[page], item],
    }));

    setShowForm(false);
    setEditing(null);
    setForm({});
  }

  function removeItem(id) {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    setData((prev) => ({
      ...prev,
      [page]: prev[page].filter((x) => x.id !== id),
    }));
  }

  function changePage(id) {
    setPage(id);
    setShowForm(false);
    setSearch("");
  }

  const currentConfig = configs[page];
  const rows = currentConfig
    ? (data[page] || []).filter((item) =>
        Object.values(item).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🐔</div>
          <div>
            <strong>
              Farm<span>Care</span>
            </strong>
            <small>Farm Management System</small>
          </div>
        </div>

        <div className="nav-label">MENU UTAMA</div>
        <nav>
          {menus.map((menu) => (
            <button
              key={menu.id}
              className={`nav-item ${page === menu.id ? "active" : ""}`}
              onClick={() => changePage(menu.id)}
            >
              <span className="nav-icon">{menu.icon}</span>
              {menu.label}
              {page === menu.id && <span className="nav-marker" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="farm-avatar">🐓</div>
          <div>
            <strong>Peternakan Saya</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            FarmCare <span>/</span> {menus.find((m) => m.id === page)?.label}
          </div>
          <div className="topbar-right">
            <span className="status-dot" />
            <span>Sistem operasional</span>
            <div className="user-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">MANAJEMEN PETERNAKAN</div>
              <h1>
                {page === "dashboard"
                  ? "Dashboard"
                  : page === "laporan"
                    ? "Laporan Operasional"
                    : currentConfig?.title}
              </h1>
              <p>
                {page === "dashboard"
                  ? "Pantau kondisi peternakan Anda dalam satu tempat."
                  : page === "laporan"
                    ? "Ringkasan data berdasarkan bulan yang dipilih."
                    : currentConfig?.description}
              </p>
            </div>
            <label className="month-select">
              <span>Periode</span>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>
          </div>

          {page === "dashboard" && (
            <>
              <section className="stat-grid">
                <StatCard
                  title="Pendapatan Penjualan"
                  value={money(totals.sales)}
                  icon="↗"
                  color="green"
                  note="Total penjualan bulan ini"
                />
                <StatCard
                  title="Total Pengeluaran"
                  value={money(totals.expenses)}
                  icon="↘"
                  color="orange"
                  note="Pembelian pakan + biaya lain"
                />
                <StatCard
                  title="Produksi Telur"
                  value={`${number(totals.eggs)} butir`}
                  icon="🥚"
                  color="yellow"
                  note={`${number(totals.damaged)} telur rusak`}
                />
                <StatCard
                  title="Stok Pakan"
                  value={`${number(totals.stock)} kg`}
                  icon="◈"
                  color="blue"
                  note="Masuk dikurangi penggunaan"
                />
              </section>

              <section className="content-grid">
                <div className="panel financial-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Ringkasan Keuangan</h2>
                      <p>Periode {month}</p>
                    </div>
                    <span className="panel-icon">Rp</span>
                  </div>
                  <div className="net-label">
                    Selisih pendapatan dan pengeluaran
                  </div>
                  <div
                    className={`net-value ${totals.net < 0 ? "negative" : ""}`}
                  >
                    {money(totals.net)}
                  </div>
                  <div className="finance-row">
                    <span>
                      <i className="legend-dot green-bg" /> Pendapatan
                    </span>
                    <strong>{money(totals.sales)}</strong>
                  </div>
                  <div className="finance-row">
                    <span>
                      <i className="legend-dot orange-bg" /> Pembelian pakan
                    </span>
                    <strong>{money(totals.feedCost)}</strong>
                  </div>
                  <div className="finance-row">
                    <span>
                      <i className="legend-dot blue-bg" /> Pengeluaran lain
                    </span>
                    <strong>{money(totals.otherExpenses)}</strong>
                  </div>
                  <div className="finance-bar">
                    <div
                      style={{
                        width: `${totals.sales + totals.expenses > 0 ? (totals.sales / (totals.sales + totals.expenses)) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="bar-label">
                    <span>Pendapatan dibanding pengeluaran</span>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Ringkasan Produksi</h2>
                      <p>Data bulan terpilih</p>
                    </div>
                    <span className="panel-icon egg-icon">🥚</span>
                  </div>
                  <div className="production-number">
                    {number(totals.eggs)} <small>butir</small>
                  </div>
                  <p className="muted">Total telur yang dihasilkan</p>
                  <div className="mini-stats">
                    <div>
                      <span>Telur rusak</span>
                      <strong>{number(totals.damaged)} butir</strong>
                    </div>
                    <div>
                      <span>Telur baik</span>
                      <strong>
                        {number(Math.max(0, totals.eggs - totals.damaged))}{" "}
                        butir
                      </strong>
                    </div>
                    <div>
                      <span>Telur terjual</span>
                      <strong>
                        {number(
                          monthData.penjualan.reduce(
                            (s, x) => s + Number(x.jumlah || 0),
                            0,
                          ),
                        )}{" "}
                        butir
                      </strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="panel quick-panel">
                <div className="panel-header">
                  <div>
                    <h2>Akses Cepat</h2>
                    <p>Pilih aktivitas yang ingin dicatat</p>
                  </div>
                </div>
                <div className="quick-grid">
                  {[
                    "pakan",
                    "penggunaan",
                    "produksi",
                    "penjualan",
                    "pengeluaran",
                  ].map((id) => (
                    <button
                      className="quick-action"
                      key={id}
                      onClick={() => {
                        changePage(id);
                        setForm({ tanggal: today() });
                        setShowForm(true);
                      }}
                    >
                      <span className="quick-icon">
                        {menus.find((m) => m.id === id)?.icon}
                      </span>
                      <span>{menus.find((m) => m.id === id)?.label}</span>
                      <b>＋</b>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {currentConfig && (
            <section className="panel table-panel">
              <div className="table-toolbar">
                <div>
                  <h2>Daftar Data</h2>
                  <p>{rows.length} data ditemukan</p>
                </div>
                <div className="toolbar-actions">
                  <input
                    className="search-input"
                    placeholder="Cari data..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="primary-button" onClick={openCreate}>
                    ＋ Tambah Data
                  </button>
                </div>
              </div>

              {showForm && (
                <form className="data-form" onSubmit={saveForm}>
                  <div className="form-heading">
                    <h3>{editing ? "Edit Data" : "Tambah Data Baru"}</h3>
                    <button
                      type="button"
                      className="close-button"
                      onClick={() => setShowForm(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="form-grid">
                    {currentConfig.fields.map((field) => (
                      <label key={field.name}>
                        {field.label}
                        <input
                          type={field.type || "text"}
                          placeholder={field.placeholder || ""}
                          min={field.type === "number" ? 0 : undefined}
                          step={field.type === "number" ? "any" : undefined}
                          required={
                            field.name !== "rusak" &&
                            field.name !== "keterangan"
                          }
                          value={form[field.name] ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, [field.name]: e.target.value })
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowForm(false)}
                    >
                      Batal
                    </button>
                    <button className="primary-button" type="submit">
                      Simpan Data
                    </button>
                  </div>
                </form>
              )}

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      {currentConfig.fields
                        .filter((f) => f.name !== "tanggal")
                        .map((f) => (
                          <th key={f.name}>{f.label}</th>
                        ))}
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={currentConfig.fields.length + 1}
                          className="empty-state"
                        >
                          Belum ada data. Klik “Tambah Data” untuk mulai
                          mencatat.
                        </td>
                      </tr>
                    ) : (
                      rows.map((item) => (
                        <tr key={item.id}>
                          <td>{item.tanggal || "-"}</td>
                          {currentConfig.fields
                            .filter((f) => f.name !== "tanggal")
                            .map((f) => (
                              <td key={f.name}>
                                {f.name === "harga" ||
                                (page === "pengeluaran" && f.name === "jumlah")
                                  ? money(Number(item[f.name] || 0))
                                  : numberIfNumeric(item[f.name])}
                              </td>
                            ))}
                          <td>
                            <div className="row-actions">
                              <button
                                className="edit-button"
                                onClick={() => openEdit(item)}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => removeItem(item.id)}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                Data disimpan pada browser ini · {rows.length} catatan
              </div>
            </section>
          )}

          {page === "laporan" && (
            <>
              <section className="stat-grid report-grid">
                <StatCard
                  title="Pendapatan"
                  value={money(totals.sales)}
                  icon="↗"
                  color="green"
                  note="Penjualan telur"
                />
                <StatCard
                  title="Pembelian Pakan"
                  value={money(totals.feedCost)}
                  icon="◈"
                  color="blue"
                  note="Biaya pembelian pakan"
                />
                <StatCard
                  title="Pengeluaran Lain"
                  value={money(totals.otherExpenses)}
                  icon="↘"
                  color="orange"
                  note="Biaya operasional lainnya"
                />
                <StatCard
                  title="Selisih"
                  value={money(totals.net)}
                  icon="＝"
                  color="yellow"
                  note="Pendapatan dikurangi biaya tercatat"
                />
              </section>
              <section className="panel report-panel">
                <h2>Laporan Operasional Bulanan</h2>
                <p className="muted">Periode: {month}</p>
                <div className="report-row">
                  <span>Total pakan masuk</span>
                  <strong>{number(totals.feedIn)} kg</strong>
                </div>
                <div className="report-row">
                  <span>Total pakan digunakan</span>
                  <strong>{number(totals.feedUsed)} kg</strong>
                </div>
                <div className="report-row">
                  <span>Estimasi stok akhir pakan</span>
                  <strong>{number(totals.stock)} kg</strong>
                </div>
                <div className="report-row">
                  <span>Total produksi telur</span>
                  <strong>{number(totals.eggs)} butir</strong>
                </div>
                <div className="report-row">
                  <span>Total telur rusak</span>
                  <strong>{number(totals.damaged)} butir</strong>
                </div>
                <div className="report-row">
                  <span>Total telur terjual</span>
                  <strong>
                    {number(
                      monthData.penjualan.reduce(
                        (s, x) => s + Number(x.jumlah || 0),
                        0,
                      ),
                    )}{" "}
                    butir
                  </strong>
                </div>
                <button
                  className="primary-button print-button"
                  onClick={() => window.print()}
                >
                  Cetak / Simpan PDF
                </button>
                <p className="disclaimer">
                  Catatan: selisih keuangan ini masih estimasi kas sederhana.
                  Biaya pakan dihitung dari pembelian, bukan dari pakan yang
                  dikonsumsi.
                </p>
              </section>
            </>
          )}

          <footer className="footer">
            © 2026 FarmCare · Sistem Manajemen Peternakan Ayam Petelur
          </footer>
        </div>
      </main>
    </div>
  );
}

function numberIfNumeric(value) {
  if (value === undefined || value === null || value === "") return "-";
  if (
    typeof value === "number" ||
    (String(value).trim() !== "" && !isNaN(Number(value)))
  ) {
    return number(Number(value));
  }
  return value;
}

function StatCard({ title, value, icon, color, note }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </article>
  );
}
