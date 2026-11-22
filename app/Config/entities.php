<?php
declare(strict_types=1);

return [
    'pakan' => [
        'title' => 'Manajemen Pakan',
        'description' => 'Kelola pembelian dan persediaan pakan.',
        'table' => 'pakan',
        'fields' => [
            ['name' => 'tanggal', 'label' => 'Tanggal pembelian', 'type' => 'date', 'rules' => ['required', 'date']],
            ['name' => 'nama', 'label' => 'Nama pakan', 'type' => 'text', 'placeholder' => 'Contoh: Pakan layer', 'rules' => ['required', 'maxlen:120']],
            ['name' => 'jumlah', 'label' => 'Jumlah masuk (kg)', 'type' => 'number', 'step' => 'any', 'rules' => ['required', 'positive']],
            ['name' => 'harga', 'label' => 'Harga per kg (Rp)', 'type' => 'number', 'step' => '1', 'format' => 'money', 'rules' => ['required', 'int', 'min:0']],
        ],
    ],
    'penggunaan' => [
        'title' => 'Penggunaan Pakan',
        'description' => 'Catat konsumsi pakan harian.',
        'table' => 'penggunaan_pakan',
        'fields' => [
            ['name' => 'tanggal', 'label' => 'Tanggal penggunaan', 'type' => 'date', 'rules' => ['required', 'date']],
            ['name' => 'nama', 'label' => 'Nama pakan', 'type' => 'text', 'placeholder' => 'Contoh: Pakan layer', 'nullable' => true, 'rules' => ['maxlen:120']],
            ['name' => 'jumlah', 'label' => 'Jumlah digunakan (kg)', 'type' => 'number', 'step' => 'any', 'rules' => ['required', 'positive']],
        ],
    ],
    'produksi' => [
        'title' => 'Produksi Telur',
        'description' => 'Pantau hasil produksi harian. Satu catatan per tanggal.',
        'table' => 'produksi_telur',
        'unique_date' => true,
        'cross' => 'produksi',
        'fields' => [
            ['name' => 'tanggal', 'label' => 'Tanggal produksi', 'type' => 'date', 'rules' => ['required', 'date']],
            ['name' => 'jumlah', 'label' => 'Total telur dipanen (butir)', 'type' => 'number', 'step' => '1', 'rules' => ['required', 'int', 'min:0']],
            ['name' => 'rusak', 'label' => 'Termasuk telur rusak (butir)', 'type' => 'number', 'step' => '1', 'nullable' => true, 'default' => 0, 'rules' => ['int', 'min:0']],
        ],
    ],
    'penjualan' => [
        'title' => 'Penjualan Telur',
        'description' => 'Catat transaksi penjualan telur.',
        'table' => 'penjualan_telur',
        'fields' => [
            ['name' => 'tanggal', 'label' => 'Tanggal penjualan', 'type' => 'date', 'rules' => ['required', 'date']],
            ['name' => 'jumlah', 'label' => 'Jumlah terjual (butir)', 'type' => 'number', 'step' => '1', 'rules' => ['required', 'int', 'positive']],
            ['name' => 'harga', 'label' => 'Harga per butir (Rp)', 'type' => 'number', 'step' => '1', 'format' => 'money', 'rules' => ['required', 'int', 'min:0']],
            ['name' => 'pelanggan', 'label' => 'Nama pelanggan', 'type' => 'text', 'placeholder' => 'Nama pembeli', 'nullable' => true, 'rules' => ['maxlen:120']],
        ],
    ],
    'pengeluaran' => [
        'title' => 'Pengeluaran Operasional',
        'description' => 'Catat biaya selain pembelian pakan.',
        'table' => 'pengeluaran',
        'fields' => [
            ['name' => 'tanggal', 'label' => 'Tanggal pengeluaran', 'type' => 'date', 'rules' => ['required', 'date']],
            ['name' => 'nama', 'label' => 'Kategori biaya', 'type' => 'text', 'placeholder' => 'Contoh: Obat ayam', 'rules' => ['required', 'maxlen:120']],
            ['name' => 'jumlah', 'label' => 'Nominal (Rp)', 'type' => 'number', 'step' => '1', 'format' => 'money', 'rules' => ['required', 'int', 'positive']],
            ['name' => 'keterangan', 'label' => 'Keterangan', 'type' => 'text', 'placeholder' => 'Catatan tambahan', 'nullable' => true, 'rules' => ['maxlen:255']],
        ],
    ],
];
