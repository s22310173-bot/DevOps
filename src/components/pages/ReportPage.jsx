import { StatCard } from "../common/StatCard";
import { money, number } from "../../lib/format";

export function ReportPage({ finance, feed, eggs, month }) {
  return (
    <>
      <section className="stat-grid report-grid">
        <StatCard
          title="Pendapatan"
          value={money(finance.salesMonth)}
          icon="↗"
          color="green"
          note="Penjualan telur"
        />
        <StatCard
          title="Pembelian Pakan"
          value={money(finance.feedCostMonth)}
          icon="◈"
          color="blue"
          note="Biaya pembelian pakan"
        />
        <StatCard
          title="Pengeluaran Lain"
          value={money(finance.otherExpensesMonth)}
          icon="↘"
          color="orange"
          note="Biaya operasional lainnya"
        />
        <StatCard
          title="Selisih"
          value={money(finance.netMonth)}
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
          <strong>{number(feed.inMonth)} kg</strong>
        </div>
        <div className="report-row">
          <span>Total pakan digunakan</span>
          <strong>{number(feed.usedMonth)} kg</strong>
        </div>
        <div className="report-row">
          <span>Stok pakan (kumulatif)</span>
          <strong>{number(feed.stock)} kg</strong>
        </div>
        <div className="report-row">
          <span>Nilai pakan terpakai (estimasi)</span>
          <strong>{money(feed.usedValue)}</strong>
        </div>
        <div className="report-row">
          <span>Total produksi telur</span>
          <strong>{number(eggs.producedMonth)} butir</strong>
        </div>
        <div className="report-row">
          <span>Total telur rusak</span>
          <strong>{number(eggs.damagedMonth)} butir</strong>
        </div>
        <div className="report-row">
          <span>Total telur terjual</span>
          <strong>{number(eggs.soldMonth)} butir</strong>
        </div>
        <div className="report-row">
          <span>Stok telur (kumulatif)</span>
          <strong>{number(eggs.stock)} butir</strong>
        </div>
        <div className="report-row">
          <span>HD% (hari tercatat)</span>
          <strong>
            {eggs.hdPercent === null ? "—" : `${number(eggs.hdPercent)}%`}
          </strong>
        </div>
        <button
          className="primary-button print-button"
          onClick={() => window.print()}
        >
          Cetak / Simpan PDF
        </button>
        <p className="disclaimer">
          Catatan: selisih keuangan ini masih estimasi kas sederhana. Biaya
          pakan dihitung dari pembelian, bukan dari pakan yang dikonsumsi.
        </p>
      </section>
    </>
  );
}
