<?php
$finance = $summary['finance'];
$feed = $summary['feed'];
$eggs = $summary['eggs'];
$populasi = $summary['populasi'];
$barWidth = ($finance['salesMonth'] + $finance['expensesMonth']) > 0
    ? ($finance['salesMonth'] / ($finance['salesMonth'] + $finance['expensesMonth'])) * 100
    : 0;
$quickEntities = ['pakan', 'penggunaan', 'produksi', 'penjualan', 'pengeluaran'];
$menuById = [];
foreach (menu_items() as $item) {
    $menuById[$item['id']] = $item;
}
?>
<div class="page-heading d-flex flex-wrap justify-content-between align-items-start gap-3">
    <div>
        <h1>Dashboard</h1>
        <p>Pantau kondisi peternakan Anda dalam satu tempat.</p>
    </div>
    <form method="get" action="/" class="d-flex align-items-center gap-2">
        <label class="small text-muted mb-0" for="month">Periode</label>
        <input class="form-control form-control-sm" type="month" id="month" name="month"
               value="<?= e($month) ?>" onchange="this.form.submit()">
    </form>
</div>

<div class="row g-3 mb-3">
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-title">Pendapatan Penjualan</div>
                    <div class="stat-value"><?= e(money($finance['salesMonth'])) ?></div>
                    <div class="stat-note">Total penjualan bulan ini</div>
                </div>
                <span class="stat-icon">↗</span>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-title">Total Pengeluaran</div>
                    <div class="stat-value"><?= e(money($finance['expensesMonth'])) ?></div>
                    <div class="stat-note">Pembelian pakan + biaya lain</div>
                </div>
                <span class="stat-icon">↘</span>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-title">Produksi Telur</div>
                    <div class="stat-value"><?= e(num($eggs['producedMonth'])) ?> butir</div>
                    <div class="stat-note"><?= e(num($eggs['damagedMonth'])) ?> telur rusak</div>
                </div>
                <span class="stat-icon">🥚</span>
            </div>
        </div>
    </div>
    <div class="col-12 col-sm-6 col-xl-3">
        <div class="stat-card p-3">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="stat-title">Stok Pakan</div>
                    <div class="stat-value"><?= e(num($feed['stock'])) ?> kg</div>
                    <div class="stat-note">Saldo kumulatif sejak awal</div>
                </div>
                <span class="stat-icon">◈</span>
            </div>
        </div>
    </div>
</div>

<div class="row g-3 mb-3">
    <div class="col-12 col-lg-6">
        <div class="panel">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h2>Ringkasan Keuangan</h2>
                    <p class="muted mb-0">Periode bulan <?= e($month) ?></p>
                </div>
                <span class="stat-icon">Rp</span>
            </div>
            <div class="small text-muted mt-3">Selisih pendapatan dan pengeluaran</div>
            <div class="net-value <?= $finance['netMonth'] < 0 ? 'negative' : '' ?>">
                <?= e(money($finance['netMonth'])) ?>
            </div>
            <div class="finance-row mt-2"><span>Pendapatan</span><strong><?= e(money($finance['salesMonth'])) ?></strong></div>
            <div class="finance-row"><span>Pembelian pakan</span><strong><?= e(money($finance['feedCostMonth'])) ?></strong></div>
            <div class="finance-row"><span>Pengeluaran lain</span><strong><?= e(money($finance['otherExpensesMonth'])) ?></strong></div>
            <div class="finance-row"><span>Nilai pakan terpakai (estimasi)</span><strong><?= e(money($feed['usedValue'])) ?></strong></div>
            <div class="progress mt-3" style="height: 8px;">
                <div class="progress-bar bg-success" role="progressbar" style="width: <?= e(number_format($barWidth, 1, '.', '')) ?>%"></div>
            </div>
            <div class="small text-muted mt-2">Pendapatan dibanding pengeluaran</div>
        </div>
    </div>

    <div class="col-12 col-lg-6">
        <div class="panel">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h2>Ringkasan Produksi</h2>
                    <p class="muted mb-0">Data bulan terpilih</p>
                </div>
                <span class="stat-icon">🥚</span>
            </div>
            <div class="production-number"><?= e(num($eggs['producedMonth'])) ?> <small>butir</small></div>
            <p class="muted">Total telur yang dihasilkan</p>
            <div class="mini-stats">
                <div>
                    <span>Populasi ayam</span>
                    <form method="post" action="/pengaturan" class="d-flex align-items-center gap-1 m-0">
                        <?= App\Core\Csrf::field() ?>
                        <input class="inline-input" type="number" min="0" name="populasi" value="<?= e($populasi) ?>">
                        <button type="submit" class="btn btn-sm btn-outline-success py-0 px-2">Simpan</button>
                    </form>
                </div>
                <div><span>HD% (hari tercatat)</span><strong><?= $eggs['hdPercent'] === null ? '—' : e(num($eggs['hdPercent'])) . '%' ?></strong></div>
                <div><span>Telur rusak</span><strong><?= e(num($eggs['damagedMonth'])) ?> butir</strong></div>
                <div><span>Telur baik</span><strong><?= e(num($eggs['goodMonth'])) ?> butir</strong></div>
                <div><span>Telur terjual</span><strong><?= e(num($eggs['soldMonth'])) ?> butir</strong></div>
                <div><span>Sisa telur (kumulatif)</span><strong class="<?= $eggs['stock'] < 0 ? 'text-danger' : '' ?>"><?= e(num($eggs['stock'])) ?> butir</strong></div>
            </div>
            <?php if ($eggs['stock'] < 0): ?>
                <p class="warning-text">Stok telur negatif: penjualan melebihi produksi tercatat.</p>
            <?php endif; ?>
            <?php if ($feed['stock'] < 0): ?>
                <p class="warning-text">Stok pakan negatif: mungkin ada pembelian belum dicatat.</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<div class="panel">
    <div class="mb-3">
        <h2>Akses Cepat</h2>
        <p class="muted mb-0">Pilih aktivitas yang ingin dicatat</p>
    </div>
    <div class="row g-2">
        <?php foreach ($quickEntities as $id): ?>
            <div class="col-12 col-sm-6 col-lg-4">
                <a class="quick-action" href="/<?= e($id) ?>/create">
                    <span class="quick-icon"><?= $menuById[$id]['icon'] ?? '＋' ?></span>
                    <span class="flex-grow-1"><?= e($menuById[$id]['label'] ?? $id) ?></span>
                    <strong>＋</strong>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
</div>
