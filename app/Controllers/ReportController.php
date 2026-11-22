<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Summary;

class ReportController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();

        $month = (string) ($_GET['month'] ?? current_month());
        $summary = Summary::build($month) ?? Summary::build(current_month());

        $this->view('report/index', [
            'title' => 'Laporan Operasional',
            'description' => 'Ringkasan data berdasarkan bulan yang dipilih.',
            'summary' => $summary,
            'month' => $summary['month'] ?? $month,
            'flash' => $this->takeFlash(),
        ]);
    }
}
