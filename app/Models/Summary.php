<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

class Summary
{
    public static function build(string $month): ?array
    {
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            return null;
        }
        [$year, $monthIndex] = array_map('intval', explode('-', $month));
        if ($monthIndex < 1 || $monthIndex > 12) {
            return null;
        }

        $start = sprintf('%04d-%02d-01', $year, $monthIndex);
        $end = date('Y-m-d', strtotime($start . ' +1 month'));
        $monthFilter = ' AND tanggal >= ? AND tanggal < ?';
        $monthParams = [$start, $end];

        $feedInTotal = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM pakan WHERE deleted_at IS NULL');
        $feedCostTotal = self::scalar('SELECT COALESCE(SUM(jumlah * harga),0) FROM pakan WHERE deleted_at IS NULL');
        $feedUsedTotal = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM penggunaan_pakan WHERE deleted_at IS NULL');

        $feedInMonth = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM pakan WHERE deleted_at IS NULL' . $monthFilter, $monthParams);
        $feedCostMonth = self::scalar('SELECT COALESCE(SUM(jumlah * harga),0) FROM pakan WHERE deleted_at IS NULL' . $monthFilter, $monthParams);
        $feedUsedMonth = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM penggunaan_pakan WHERE deleted_at IS NULL' . $monthFilter, $monthParams);

        $eggsMonth = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM produksi_telur WHERE deleted_at IS NULL' . $monthFilter, $monthParams);
        $damagedMonth = self::scalar('SELECT COALESCE(SUM(rusak),0) FROM produksi_telur WHERE deleted_at IS NULL' . $monthFilter, $monthParams);
        $productionDays = (int) self::scalar('SELECT COUNT(*) FROM produksi_telur WHERE deleted_at IS NULL' . $monthFilter, $monthParams);

        $soldEggsMonth = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM penjualan_telur WHERE deleted_at IS NULL' . $monthFilter, $monthParams);
        $salesMonth = self::scalar('SELECT COALESCE(SUM(jumlah * harga),0) FROM penjualan_telur WHERE deleted_at IS NULL' . $monthFilter, $monthParams);
        $otherExpensesMonth = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM pengeluaran WHERE deleted_at IS NULL' . $monthFilter, $monthParams);

        $goodEggsTotal = self::scalar('SELECT COALESCE(SUM(jumlah - rusak),0) FROM produksi_telur WHERE deleted_at IS NULL');
        $soldEggsTotal = self::scalar('SELECT COALESCE(SUM(jumlah),0) FROM penjualan_telur WHERE deleted_at IS NULL');

        $populasi = (int) self::scalar('SELECT COALESCE(populasi,0) FROM pengaturan WHERE id = 1');

        $avgFeedPrice = $feedInTotal > 0 ? $feedCostTotal / $feedInTotal : 0;
        $feedUsedValue = (int) round($feedUsedMonth * $avgFeedPrice);

        $hdPercent = ($populasi > 0 && $productionDays > 0)
            ? round(($eggsMonth / ($populasi * $productionDays)) * 100, 2)
            : null;

        return [
            'month' => $month,
            'populasi' => $populasi,
            'feed' => [
                'inMonth' => $feedInMonth,
                'usedMonth' => $feedUsedMonth,
                'stock' => $feedInTotal - $feedUsedTotal,
                'costMonth' => $feedCostMonth,
                'usedValue' => $feedUsedValue,
                'avgPrice' => (int) round($avgFeedPrice),
            ],
            'eggs' => [
                'producedMonth' => $eggsMonth,
                'damagedMonth' => $damagedMonth,
                'goodMonth' => $eggsMonth - $damagedMonth,
                'soldMonth' => $soldEggsMonth,
                'stock' => $goodEggsTotal - $soldEggsTotal,
                'productionDays' => $productionDays,
                'hdPercent' => $hdPercent,
            ],
            'finance' => [
                'salesMonth' => $salesMonth,
                'feedCostMonth' => $feedCostMonth,
                'otherExpensesMonth' => $otherExpensesMonth,
                'expensesMonth' => $feedCostMonth + $otherExpensesMonth,
                'netMonth' => $salesMonth - $feedCostMonth - $otherExpensesMonth,
            ],
        ];
    }

    private static function scalar(string $sql, array $params = []): float
    {
        $stmt = Database::pdo()->prepare($sql);
        $stmt->execute($params);
        return (float) $stmt->fetchColumn();
    }
}
