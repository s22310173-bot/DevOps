<?php
$finance = $summary['finance'];
$feed = $summary['feed'];
$eggs = $summary['eggs'];
?>
<div class="page-heading d-flex flex-wrap justify-content-between align-items-start gap-3 no-print">
    <div>
        <h1>Laporan Operasional</h1>
        <p>Ringkasan data berdasarkan bulan yang dipilih.</p>
    </div>
    <form method="get" action="/laporan" class="d-flex align-items-center gap-2">
        <label class="small text-muted mb-0" for="month">Periode</label>
        <input class="form-control form-control-sm" type="month" id="month" name="month"
               value="<?= e($month) ?>" onchange="this.form.submit()">
    </form>
</div>

<div class="row g-3 mb-3">
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="stat-title">Pendapatan</div>
            <div class="stat-value"><?= e(money($finance['salesMonth'])) ?></div>
            <div class="stat-note">Penjualan telur</div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="stat-title">Pembelian Pakan</div>
            <div class="stat-value"><?= e(money($finance['feedCostMonth'])) ?></div>
            <div class="stat-note">Biaya pembelian pakan</div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="stat-title">Pengeluaran Lain</div>
            <div class="stat-value"><?= e(money($finance['otherExpensesMonth'])) ?></div>
            <div class="stat-note">Biaya operasional lainnya</div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="stat-title">Selisih</div>
            <div class="stat-value <?= $finance['netMonth'] < 0 ? 'text-danger' : '' ?>"><?= e(money($finance['netMonth'])) ?></div>
            <div class="stat-note">Pendapatan dikurangi biaya tercatat</div>
        </div>
    </div>
</div>

<div class="panel">
    <h2>Laporan Operasional Bulanan</h2>
    <p class="muted">Periode: <?= e($month) ?></p>

    <div class="report-row"><span>Total pakan masuk</span><strong><?= e(num($feed['inMonth'])) ?> kg</strong></div>
    <div class="report-row"><span>Total pakan digunakan</span><strong><?= e(num($feed['usedMonth'])) ?> kg</strong></div>
    <div class="report-row"><span>Stok pakan (kumulatif)</span><strong><?= e(num($feed['stock'])) ?> kg</strong></div>
    <div class="report-row"><span>Nilai pakan terpakai (estimasi)</span><strong><?= e(money($feed['usedValue'])) ?></strong></div>
    <div class="report-row"><span>Total produksi telur</span><strong><?= e(num($eggs['producedMonth'])) ?> butir</strong></div>
    <div class="report-row"><span>Total telur rusak</span><strong><?= e(num($eggs['damagedMonth'])) ?> butir</strong></div>
    <div class="report-row"><span>Total telur terjual</span><strong><?= e(num($eggs['soldMonth'])) ?> butir</strong></div>
    <div class="report-row"><span>Stok telur (kumulatif)</span><strong><?= e(num($eggs['stock'])) ?> butir</strong></div>
    <div class="report-row"><span>HD% (hari tercatat)</span><strong><?= $eggs['hdPercent'] === null ? '—' : e(num($eggs['hdPercent'])) . '%' ?></strong></div>

    <button type="button" class="btn btn-success mt-4 no-print" onclick="window.print()">Cetak / Simpan PDF</button>
    <p class="disclaimer">
        Catatan: selisih keuangan ini masih estimasi kas sederhana. Biaya pakan dihitung dari pembelian,
        bukan dari pakan yang dikonsumsi.
    </p>
</div>
