import { money } from "../../lib/format";

export function FinancialPanel({ finance, feed, month }) {
  return (
    <div className="panel financial-panel">
      <div className="panel-header">
        <div>
          <h2>Ringkasan Keuangan</h2>
          <p>Periode {month}</p>
        </div>
        <span className="panel-icon">Rp</span>
      </div>
      <div className="net-label">Selisih pendapatan dan pengeluaran</div>
      <div
        className={`net-value ${finance.netMonth < 0 ? "negative" : ""}`}
      >
        {money(finance.netMonth)}
      </div>
      <div className="finance-row">
        <span>
          <i className="legend-dot green-bg" /> Pendapatan
        </span>
        <strong>{money(finance.salesMonth)}</strong>
      </div>
      <div className="finance-row">
        <span>
          <i className="legend-dot orange-bg" /> Pembelian pakan
        </span>
        <strong>{money(finance.feedCostMonth)}</strong>
      </div>
      <div className="finance-row">
        <span>
          <i className="legend-dot blue-bg" /> Pengeluaran lain
        </span>
        <strong>{money(finance.otherExpensesMonth)}</strong>
      </div>
      <div className="finance-row">
        <span>Nilai pakan terpakai (estimasi)</span>
        <strong>{money(feed.usedValue)}</strong>
      </div>
      <div className="finance-bar">
        <div
          style={{
            width: `${
              finance.salesMonth + finance.expensesMonth > 0
                ? (finance.salesMonth /
                    (finance.salesMonth + finance.expensesMonth)) *
                  100
                : 0
            }%`,
          }}
        />
      </div>
      <div className="bar-label">
        <span>Pendapatan dibanding pengeluaran</span>
      </div>
    </div>
  );
}
