import { number } from "../../lib/format";

export function ProductionPanel({
  eggs,
  feed,
  populasiDraft,
  onPopulasiChange,
  onPopulasiSave,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Ringkasan Produksi</h2>
          <p>Data bulan terpilih</p>
        </div>
        <span className="panel-icon egg-icon">🥚</span>
      </div>
      <div className="production-number">
        {number(eggs.producedMonth)} <small>butir</small>
      </div>
      <p className="muted">Total telur yang dihasilkan</p>
      <div className="mini-stats">
        <div>
          <span>Populasi ayam</span>
          <input
            className="inline-input"
            type="number"
            min="0"
            value={populasiDraft}
            onChange={(e) => onPopulasiChange(e.target.value)}
            onBlur={onPopulasiSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          />
        </div>
        <div>
          <span>HD% (hari tercatat)</span>
          <strong>
            {eggs.hdPercent === null ? "—" : `${number(eggs.hdPercent)}%`}
          </strong>
        </div>
        <div>
          <span>Telur rusak</span>
          <strong>{number(eggs.damagedMonth)} butir</strong>
        </div>
        <div>
          <span>Telur baik</span>
          <strong>{number(eggs.goodMonth)} butir</strong>
        </div>
        <div>
          <span>Telur terjual</span>
          <strong>{number(eggs.soldMonth)} butir</strong>
        </div>
        <div>
          <span>Sisa telur (kumulatif)</span>
          <strong className={eggs.stock < 0 ? "negative-text" : ""}>
            {number(eggs.stock)} butir
          </strong>
        </div>
      </div>
      {eggs.stock < 0 && (
        <p className="warning-text">
          Stok telur negatif: penjualan melebihi produksi tercatat.
        </p>
      )}
      {feed.stock < 0 && (
        <p className="warning-text">
          Stok pakan negatif: mungkin ada pembelian belum dicatat.
        </p>
      )}
    </div>
  );
}
